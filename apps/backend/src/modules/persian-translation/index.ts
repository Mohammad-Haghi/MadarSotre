import type { LoaderOptions, LocaleDTO } from "@medusajs/framework/types";
import translation from "@medusajs/medusa/translation";

export { discoveryPath } from "@medusajs/medusa/translation";

type LocaleService = {
  list(filters: object, config: object): Promise<LocaleDTO[]>;
  create(data: { code: string; name: string }): Promise<unknown>;
  delete(ids: string[]): Promise<unknown>;
};

async function persianLocales({ container }: LoaderOptions) {
  const locales = container.resolve<LocaleService>("localeService");
  const existing = await locales.list({}, { take: null });
  if (!existing.some((locale) => locale.code === "fa")) {
    await locales.create({ code: "fa", name: "فارسی" });
  }
  const ids = existing.filter((locale) => locale.code !== "fa").map((locale) => locale.id);
  if (ids.length) await locales.delete(ids);
}

// Medusa reloads discoveryPath to discover the original models and migrations.
// Configure that same module export so it also uses our locale loader.
translation.loaders = [persianLocales];
export default translation;
