import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createCustomerAccount, type CustomerAccountInput } from "../../../auth/create-customer-account";

export async function POST(req: MedusaRequest<CustomerAccountInput>, res: MedusaResponse) {
  const customer = await createCustomerAccount(req.scope, req.body);
  res.status(201).json({ customer });
}
