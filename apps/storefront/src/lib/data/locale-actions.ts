"use server"

import { defaultLocale } from "@i18n/config"
import { sdk } from "@lib/config"
import { COOKIE_NAMES, persistentCookieOpts } from "@lib/cookie-config"
import { revalidateTag } from "next/cache"
import { cookies as nextCookies } from "next/headers"
import { getAuthHeaders, getCacheTag, getCartId } from "./cookies"

/** Return the store's only language. */
export const getLocale = async (): Promise<string> => defaultLocale

/**
 * Sets the locale cookie
 */
export const setLocaleCookie = async (_locale: string) => {
  const cookies = await nextCookies()
  cookies.set(COOKIE_NAMES.locale, defaultLocale, persistentCookieOpts)
}

/**
 * Updates the locale preference via SDK and stores in cookie.
 * Also updates the cart with the new locale if one exists.
 */
export const updateLocale = async (_localeCode: string): Promise<string> => {
  const localeCode = defaultLocale
  await setLocaleCookie(localeCode)

  const authHeaders = await getAuthHeaders()

  // Update cart with the new locale if a cart exists
  const cartId = await getCartId()
  if (cartId) {
    const headers = {
      ...authHeaders,
    }

    await sdk.store.cart.update(cartId, { locale: localeCode }, {}, headers)

    const cartCacheTag = await getCacheTag("carts")
    if (cartCacheTag) {
      revalidateTag(cartCacheTag)
    }
  }

  // Persist the locale on the customer so transactional emails can use it
  if ("authorization" in authHeaders) {
    try {
      const { customer } = await sdk.store.customer.retrieve(
        {},
        { ...authHeaders }
      )

      await sdk.store.customer.update(
        { metadata: { ...(customer?.metadata ?? {}), locale: localeCode } },
        {},
        { ...authHeaders }
      )

      const customerCacheTag = await getCacheTag("customers")
      if (customerCacheTag) {
        revalidateTag(customerCacheTag)
      }
    } catch {}
  }

  // Revalidate relevant caches to refresh content
  const productsCacheTag = await getCacheTag("products")
  if (productsCacheTag) {
    revalidateTag(productsCacheTag)
  }

  const categoriesCacheTag = await getCacheTag("categories")
  if (categoriesCacheTag) {
    revalidateTag(categoriesCacheTag)
  }

  const collectionsCacheTag = await getCacheTag("collections")
  if (collectionsCacheTag) {
    revalidateTag(collectionsCacheTag)
  }

  return localeCode
}
