import type { Plugin } from "vite" with { "resolution-mode": "import" };

/** Keep the bundled dashboard in Persian, including login and profile settings. */
export function persianAdmin(): Plugin {
  return {
    name: "persian-admin",
    enforce: "pre",
    transform(source, id) {
      const file = id.replace(/\\/g, "/").split("?")[0];
      if (!file.includes("/@medusajs/dashboard/")) return;

      let code = source;
      // Medusa bundles these modules into named chunks in published packages.
      if (code.includes("supportedLngs: Object.keys(resources)")) {
        code = code.replace(
          "supportedLngs: Object.keys(resources)",
          'lng: "fa", fallbackLng: "fa", supportedLngs: ["fa"]',
        );
      }
      if (/\b(?:var|const) languages(?:\s*:\s*Language\[\])? = \[/.test(code)) {
        code = code.replace(
          /(\b(?:var|const) languages(?:\s*:\s*Language\[\])? = \[[\s\S]*?\n\])/,
          '$1.filter((language) => language.code === "fa")',
        );
      }
      return code === source ? undefined : { code, map: null };
    },
  };
}
