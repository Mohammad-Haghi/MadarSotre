import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { saveCustomerCredentials } from "../../../../../auth/customer-credentials";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const auth = req.scope.resolve(Modules.AUTH);
  const identities = await auth.listAuthIdentities({ app_metadata: { customer_id: req.params.id } }, { relations: ["provider_identities"], take: null });
  const provider = identities.flatMap((identity) => identity.provider_identities ?? []).find((entry) => entry.provider === "usernamepass");
  res.json({ username: provider?.entity_id ?? "" });
}

export async function POST(req: MedusaRequest<{ username: string; password?: string }>, res: MedusaResponse) {
  res.json(await saveCustomerCredentials(req.scope, req.params.id, req.body));
}
