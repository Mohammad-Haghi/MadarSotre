import assert from "node:assert/strict";
import { randomInt, randomUUID } from "node:crypto";
import type { MedusaContainer } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { saveCustomerCredentials } from "../auth/customer-credentials";
import { createCustomerAccount, customersWithPhone, normalizePhone } from "../auth/create-customer-account";

export default async function check({ container }: { container: MedusaContainer }) {
  const customers = container.resolve(Modules.CUSTOMER);
  const auth = container.resolve(Modules.AUTH);
  const suffix = randomUUID().replace(/-/g, "");
  const username = `test_${suffix}`;
  const password = randomUUID();
  const phone = `09${randomInt(0, 1_000_000_000).toString().padStart(9, "0")}`;
  const customer = await createCustomerAccount(container, { phone, username, password });
  const other = await customers.createCustomers({ email: `other_${suffix}@example.test` });
  try {
    assert.equal(customer.email, null);
    assert.equal(customer.phone, normalizePhone(phone));
    assert.equal(normalizePhone("۰۹۱۲۳۴۵۶۷۸۹"), "+989123456789");
    assert.equal(normalizePhone("٠٩١٢٣٤٥٦٧٨٩"), "+989123456789");
    await assert.rejects(createCustomerAccount(container, { phone, username: `${username}_duplicate`, password }));
    await assert.rejects(createCustomerAccount(container, { phone: "invalid", username, password }));
    const failedPhone = `09${randomInt(0, 1_000_000_000).toString().padStart(9, "0")}`;
    await assert.rejects(createCustomerAccount(container, { phone: failedPhone, username, password }));
    assert.equal((await customersWithPhone(container, normalizePhone(failedPhone))).length, 0);
    await saveCustomerCredentials(container, customer.id, { username, password });
    assert.equal((await customers.retrieveCustomer(customer.id)).has_account, true);
    const login = (name: string, pass: string) => auth.authenticate("usernamepass", { body: { username: name, password: pass }, headers: {}, query: {}, url: "" });
    const result = await login(username.toUpperCase(), password);
    assert.equal(result.success, true);
    assert.equal(result.authIdentity?.app_metadata?.customer_id, customer.id);
    assert.equal(JSON.stringify(result).includes("password_hash"), false);
    assert.equal((await login(username, "wrong-password")).success, false);
    assert.equal((await login("missing_user", password)).success, false);
    await assert.rejects(saveCustomerCredentials(container, other.id, { username, password }));
    await assert.rejects(saveCustomerCredentials(container, other.id, { username: "short", password: "123" }));
    await saveCustomerCredentials(container, customer.id, { username: `${username}_new` });
    assert.equal((await login(username, password)).success, false);
    assert.equal((await login(`${username}_new`, password)).success, true);
    await saveCustomerCredentials(container, customer.id, { username: `${username}_new`, password: `${password}_changed` });
    assert.equal((await login(`${username}_new`, password)).success, false);
    assert.equal((await login(`${username}_new`, `${password}_changed`)).success, true);
    const registration = await auth.register("usernamepass", { body: { username: "public_user", password }, headers: {}, query: {}, url: "" });
    assert.equal(registration.success, false);
    console.log("PASS phone-only account creation, Persian and Arabic digits, duplicate phones, failed creation cleanup, username login, password resets, validation, registration restriction, and hash sanitization");
  } finally {
    for (const id of [customer.id, other.id]) {
      const identities = await auth.listAuthIdentities({ app_metadata: { customer_id: id } }, { take: null });
      if (identities.length) await auth.deleteAuthIdentities(identities.map((identity) => identity.id));
      await customers.deleteCustomers([id]);
    }
  }
}
