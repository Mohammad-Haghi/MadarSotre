import { getTranslations } from "next-intl/server"
import { Link } from "@i18n/navigation"

const Hero = async () => {
  const t = await getTranslations("Hero")

  return (
    <section className="relative isolate overflow-hidden bg-[#073e36] text-[#fff8e7]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 38px, #e7c583 39px, transparent 40px), repeating-linear-gradient(-45deg, transparent, transparent 38px, #e7c583 39px, transparent 40px)",
        }}
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8b875] to-transparent" />
      <div className="content-container relative grid items-center gap-12 py-14 small:grid-cols-2 small:gap-16 small:py-20">
        <div className="max-w-xl">
          <p className="mb-5 flex items-center gap-3 text-sm tracking-wide text-[#e7c583]">
            <span aria-hidden="true" className="h-px w-9 bg-[#d8b875]" />
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl font-semibold leading-[1.7] small:text-5xl small:leading-[1.7]">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg leading-9 text-[#e7c583]">{t("dedication")}</p>
          <p className="mt-5 max-w-lg text-base leading-8 text-[#e4ece5]">{t("subtitle")}</p>
          <Link
            href="/store"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-5 rounded-full bg-[#ead09b] px-7 py-3 font-semibold text-[#173e34] transition-colors hover:bg-[#f5e4bf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ead09b]"
          >
            {t("shopLink")}
            <span aria-hidden="true">&larr;</span>
          </Link>
        </div>
        <div className="relative mx-auto flex w-full max-w-[390px] items-center justify-center px-5 pb-4 pt-6 small:max-w-[450px]">
          <div aria-hidden="true" className="absolute inset-0 rounded-t-full bg-[#d8b875]/10 blur-3xl" />
          <div className="relative flex min-h-[350px] w-full flex-col items-center justify-center rounded-t-full rounded-b-[2rem] border border-[#d8b875]/60 bg-gradient-to-b from-[#145b4b] to-[#07382f] px-5 py-14 text-center shadow-2xl small:min-h-[430px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-t-full rounded-b-[1.5rem] border border-[#d8b875]/25" />
            <span aria-hidden="true" className="mb-5 text-3xl text-[#d8b875]">&#10022;</span>
            <p className="text-sm text-[#e7c583]">{t("salutation")}</p>
            <p className="my-5 text-4xl font-semibold leading-[1.8] text-[#fff5d8] small:text-5xl small:leading-[1.8]">{t("bannerName")}</p>
            <div aria-hidden="true" className="mb-5 h-px w-20 bg-gradient-to-r from-transparent via-[#d8b875] to-transparent" />
            <p className="text-sm leading-7 text-[#e4ece5]">{t("bannerCaption")}</p>
          </div>
        </div>
      </div>
      <div className="relative border-t border-[#d8b875]/20 bg-black/10 py-4 text-center text-sm text-[#e7c583]">
        <p className="content-container">{t("closing")}</p>
      </div>
    </section>
  )
}

export default Hero
