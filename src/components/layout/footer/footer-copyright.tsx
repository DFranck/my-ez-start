import { useTranslations } from "next-intl";

const FooterCopyright = () => {
  const t = useTranslations("Footer");

  return <p className="p-4 mx-4 text-center">{t("copyright")}</p>;
};

export default FooterCopyright;
