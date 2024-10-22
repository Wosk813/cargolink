import { useTranslations } from "next-intl"

export default function Page() {
    const t = useTranslations("nav")
    return (
        <h1 className="hidden text-3xl md:block">{t("announcements")}</h1>
    )
}