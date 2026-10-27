import { getLocaleDir } from "@i18n/config"
import { GA_MEASUREMENT_ID, getBaseURL } from "@lib/util/env"
import GoogleAnalytics from "@modules/common/components/google-analytics"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { getLocale } from "next-intl/server"
import "styles/globals.css"

const iranSansX = localFont({
  src: "../assets/fonts/IRANSansXVF.woff2",
  variable: "--font-iransansx",
  weight: "100 1000",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      dir={getLocaleDir(locale)}
      data-mode="light"
      className={iranSansX.variable}
    >
      <body className={iranSansX.className}>
        <main className="relative">{props.children}</main>
        {GA_MEASUREMENT_ID ? <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> : null}
      </body>
    </html>
  )
}
