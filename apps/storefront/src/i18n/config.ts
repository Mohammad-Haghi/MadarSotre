export const locales = ["fa"] as const

export const defaultLocale = "fa" as const satisfies AppLocale

export type AppLocale = (typeof locales)[number]

export const rtlLocales = ["fa"] as const satisfies readonly AppLocale[]

export type LocaleDirection = "ltr" | "rtl"

export const getLocaleDir = (locale: string): LocaleDirection =>
  (rtlLocales as readonly string[]).includes(locale) ? "rtl" : "ltr"

export type Locale = {
  code: string
  name: string
}

export const localeLabels: Record<AppLocale, string> = { fa: "فارسی" }

export const appLocales: Locale[] = locales.map((code) => ({
  code,
  name: localeLabels[code],
}))

export function isAppLocale(
  value: string | null | undefined
): value is AppLocale {
  return !!value && locales.includes(value as AppLocale)
}

export function matchBrowserLocale(
  acceptLanguage: string | null | undefined
): AppLocale | undefined {
  if (!acceptLanguage) return undefined

  const primary = acceptLanguage
    .split(",")[0]
    .trim()
    .split(";")[0]
    .split("-")[0]
    .toLowerCase()

  return isAppLocale(primary) ? primary : undefined
}
