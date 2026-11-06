import { COOKIE_NAMES, persistentCookieOpts } from "@lib/cookie-config"
import type { HttpTypes } from "@medusajs/types"
import type { NextRequest, NextResponse } from "next/server"

export type RegionMap = Map<string, HttpTypes.StoreRegion>
export type ApplyCountry = (res: NextResponse) => NextResponse

export const resolveCountry = async (
  _request: NextRequest,
  _regionMap: RegionMap
): Promise<ApplyCountry> => (res) => {
  res.cookies.set(COOKIE_NAMES.country, "ir", persistentCookieOpts)
  return res
}
