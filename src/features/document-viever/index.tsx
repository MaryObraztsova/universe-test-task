import green_check_b from "./assets/green-check-b.svg";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { memo } from "react";

export const BannerYourDocIsReady: React.FC = memo(() => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="absolute top-0 left-0 flex justify-center items-center
          w-full bg-[#D7EFE6] py-3 tablet:py-2 rounded-[10px_10px_0_0] text-[14px] leading-[18px] font-primaryB font-semibold
          tablet:text-[18px] tablet:leading-[24px]"
      >
        <Image
          src={green_check_b}
          alt="green_check"
          className="mr-1.5 tablet:mr-3 w-4 tablet:w-6"
          loading="eager"
        />
        <p>{t("payment_page.document_is_ready")}</p>
      </div>
    </>
  );
});
