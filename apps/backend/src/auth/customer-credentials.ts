import type { MedusaContainer } from "@medusajs/framework";
import { MedusaError, Modules } from "@medusajs/framework/utils";
import { hashPassword, normalizeUsername } from "./credentials";

// Keep plaintext passwords out of workflow execution records.
export async function saveCustomerCredentials(container: MedusaContainer, customerId: string, input: { username: string; password?: string }) {
  const { username: raw, password } = input;
  if (typeof raw !== "string") throw new MedusaError(MedusaError.Types.INVALID_DATA, "نام کاربری را وارد کنید.");
  const username = normalizeUsername(raw);
  if (!/^[\p{L}\p{N}_.-]{3,64}$/u.test(username)) throw new MedusaError(MedusaError.Types.INVALID_DATA, "نام کاربری باید ۳ تا ۶۴ نویسه و شامل حروف، عدد، نقطه، خط تیره یا زیرخط باشد.");
  if (password !== undefined && (typeof password !== "string" || password.length < 8 || password.length > 256)) throw new MedusaError(MedusaError.Types.INVALID_DATA, "گذرواژه باید ۸ تا ۲۵۶ نویسه باشد.");
  const customer = await container.resolve(Modules.CUSTOMER).retrieveCustomer(customerId);
  const auth = container.resolve(Modules.AUTH);
  const identities = await auth.listAuthIdentities({ app_metadata: { customer_id: customer.id } }, { relations: ["provider_identities"], take: null });
  const current = identities.flatMap((identity) => identity.provider_identities ?? []).find((entry) => entry.provider === "usernamepass");
  const conflicts = await auth.listProviderIdentities({ provider: "usernamepass", entity_id: username });
  if (conflicts.some((entry) => entry.id !== current?.id)) throw new MedusaError(MedusaError.Types.INVALID_DATA, "این نام کاربری قبلاً استفاده شده است.");
  if (current) {
    await auth.updateProviderIdentities({ id: current.id, entity_id: username, provider_metadata: { ...current.provider_metadata, ...(password ? { password_hash: await hashPassword(password) } : {}) } });
  } else {
    if (!password) throw new MedusaError(MedusaError.Types.INVALID_DATA, "برای حساب جدید گذرواژه وارد کنید.");
    await auth.createAuthIdentities({ app_metadata: { customer_id: customer.id }, provider_identities: [{ provider: "usernamepass", entity_id: username, provider_metadata: { password_hash: await hashPassword(password) } }] });
  }
  if (!customer.has_account) {
    const account = { metadata: customer.metadata, has_account: true };
    await container.resolve(Modules.CUSTOMER).updateCustomers(customer.id, account);
  }
  return { username };
}
