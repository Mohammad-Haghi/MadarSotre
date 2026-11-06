import type { MedusaContainer } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { deleteRegionsWorkflow, updateRegionsWorkflow } from "@medusajs/medusa/core-flows";
import { seedRegions } from "./lib/regions";
import { seedTranslations } from "./lib/translations";

/** Apply the Persian and Iran configuration to an existing store. */
export default async function persianOnly({ container }: { container: MedusaContainer }) {
  const regions = container.resolve(Modules.REGION);
  const translations = container.resolve(Modules.TRANSLATION);
  const stores = container.resolve(Modules.STORE);
  const existing = await regions.listRegions({}, { relations: ["countries"], take: null });
  const iran = existing.find((region) => region.countries?.some((country) => country.iso_2 === "ir"));

  if (iran) {
    await updateRegionsWorkflow(container).run({
      input: { selector: { id: iran.id }, update: { countries: ["ir"], currency_code: "irr" } },
    });
  } else {
    await seedRegions(container);
  }

  const ids = existing.filter((region) => region.id !== iran?.id).map((region) => region.id);
  if (ids.length) await deleteRegionsWorkflow(container).run({ input: { ids } });

  const locales = await translations.listLocales({}, { take: null });
  if (!locales.some((locale) => locale.code === "fa")) {
    await translations.createLocales({ code: "fa", name: "فارسی" });
  }
  for (const store of await stores.listStores()) {
    await stores.updateStores(store.id, {
      supported_locales: [{ locale_code: "fa" }],
      supported_currencies: [{ currency_code: "irr", is_default: true }],
    });
  }
  const otherLocales = locales.filter((locale) => locale.code !== "fa");
  if (otherLocales.length) await translations.deleteLocales(otherLocales.map((locale) => locale.id));
  await seedTranslations(container);
}
