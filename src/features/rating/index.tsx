import stars_doc_b from "./assets/stars_document-b.svg";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";

export const Rating: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hidden tablet:block">
      <div className="flex flex-col gap-y-3 justify-center items-center text-[16px] leading-[24px] mt-6 text-center">
        <p>
          <strong>4.5</strong> {t("payment_page.out_of")} <strong>5</strong>{" "}
          {t("payment_page.based")} <br />
          {t("payment_page.reviews_counter")}
        </p>
        <Image src={stars_doc_b} alt="stars_doc" className="h-8 w-full" />
      </div>
    </div>
  );
};
