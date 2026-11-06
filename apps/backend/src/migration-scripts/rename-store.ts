import type { MedusaContainer } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { SEED_STORE } from "./data/store";

export default async function renameStore({ container }: { container: MedusaContainer }) {
  const stores = container.resolve(Modules.STORE);
  for (const store of await stores.listStores()) {
    await stores.updateStores(store.id, { name: SEED_STORE.name });
    const updated = await stores.retrieveStore(store.id);
    if (updated.name !== SEED_STORE.name) throw new Error("Store name update failed");
  }
  console.log("Store name updated and verified.");
}
