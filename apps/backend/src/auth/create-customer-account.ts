import type { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils";
import { saveCustomerCredentials } from "./customer-credentials";

export type CustomerAccountInput = {
  first_name?: string;
  last_name?: string;
  phone: string;
  username: string;
  password: string;
};

export async function customersWithPhone(container: MedusaContainer, phone: string) {
  const { data } = await container.resolve(ContainerRegistrationKeys.QUERY).graph({
    entity: "customer", fields: ["id"], filters: { phone },
  });
  return data;
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[\s()-]/g, "");
  if (/^09\d{9}$/.test(digits)) return `+98${digits.slice(1)}`;
  if (/^989\d{9}$/.test(digits)) return `+${digits}`;
  if (/^00989\d{9}$/.test(digits)) return `+${digits.slice(2)}`;
  if (/^\+989\d{9}$/.test(digits)) return digits;
  throw new MedusaError(MedusaError.Types.INVALID_DATA, "شماره موبایل معتبر ایران را وارد کنید.");
}

export async function createCustomerAccount(container: MedusaContainer, input: CustomerAccountInput) {
  if (typeof input.phone !== "string") throw new MedusaError(MedusaError.Types.INVALID_DATA, "شماره موبایل را وارد کنید.");
  if (typeof input.password !== "string" || input.password.length < 8 || input.password.length > 256) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "گذرواژه باید ۸ تا ۲۵۶ نویسه باشد.");
  }
  for (const name of [input.first_name, input.last_name]) {
    if (name !== undefined && (typeof name !== "string" || name.length > 100)) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "نام و نام خانوادگی باید حداکثر ۱۰۰ نویسه باشند.");
    }
  }
  const phone = normalizePhone(input.phone);
  const customers = container.resolve(Modules.CUSTOMER);
  const existing = await customersWithPhone(container, phone);
  if (existing.length) throw new MedusaError(MedusaError.Types.INVALID_DATA, "این شماره موبایل قبلاً ثبت شده است. حساب مشتری را از فهرست مشتریان باز کنید.");
  const customer = await customers.createCustomers({
    phone,
    first_name: input.first_name?.trim() || null,
    last_name: input.last_name?.trim() || null,
  });
  try {
    await saveCustomerCredentials(container, customer.id, input);
    return await customers.retrieveCustomer(customer.id);
  } catch (error) {
    const auth = container.resolve(Modules.AUTH);
    const identities = await auth.listAuthIdentities({ app_metadata: { customer_id: customer.id } }, { take: null });
    if (identities.length) await auth.deleteAuthIdentities(identities.map((identity) => identity.id));
    await customers.deleteCustomers([customer.id]);
    throw error;
  }
}
