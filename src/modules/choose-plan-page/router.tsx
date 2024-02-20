import { LoadingAnimation } from "../../components/loading-animation";
import { PrimaryButton } from "../../components/primary-button";
import { BannerYourDocIsReady } from "../../features/document-viever";
import { Rating } from "../../features/rating";
import { useFileLoader } from "../../hooks/useFileLoader";
import { usePlanInteractor } from "../../hooks/usePlanInteractor";
import { InternalFileType, PaymentPlanId } from "../../types/interactor";
import { formatAmount, getClassNames } from "../../utils/choose-plan-page";
import black_star from "./assets/black-star.svg";
import check from "./assets/check.svg";
import cross from "./assets/cross.svg";
import fake_file from "./assets/fake-file.svg";
import radio_off from "./assets/radio-off.svg";
import radio_on from "./assets/radio-on.svg";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import React, { memo, useMemo } from "react";

export interface IProps {
  header: React.ReactNode;
}
export const PaymentPageRouter: React.FC<IProps> = memo(({ header }) => {
  const { imagePDF, isImageLoading, fileType, fileLink } = useFileLoader();

  const {
    selectedPlan,
    isSecondEmail,
    isThirdEmail,
    isRemoteConfigLoading,
    isPlansLoading,
    onSelectPlan,
    onContinue,
    getPlans,
  } = usePlanInteractor();

  const isPDFFile = fileType === "PDF";
  const isImage =
    fileType === InternalFileType.JPEG ||
    fileType === InternalFileType.JPG ||
    fileType === InternalFileType.PNG;
  const { t } = useTranslation();
  const plans = getPlans(t);
  const currentPlan = plans.find((item) => item.id === selectedPlan);

  React.useEffect(() => {
    if (document.getElementsByClassName("swiper-wrapper")[0]) {
      (
        document.getElementsByClassName(
          "swiper-wrapper"
        ) as HTMLCollectionOf<HTMLElement>
      )[0].style.display = "flex";
    }
  }, [isRemoteConfigLoading, isPlansLoading]);

  const renderImage = () => {
    if (isPDFFile) {
      if (imagePDF !== null) {
        return (
          <Image
            src={URL.createObjectURL(imagePDF)}
            width={312}
            height={472}
            alt="file_img"
          />
        );
      }

      if (imagePDF === null && !isImageLoading) {
        return <Image src={fake_file} alt="fake_file" />;
      }

      return null;
    }

    if (isImage && fileLink) {
      return (
        <Image
          src={fileLink}
          alt="file_img"
          className="w-full max-w-[222px] h-auto tablet:max-w-[303px]"
          width={250}
          height={300}
        />
      );
    }

    return <Image src={fake_file} alt="fake_file" />;
  };

  const previewImage = useMemo(
    () => renderImage(),
    [imagePDF, isPDFFile, isImage, fileLink]
  );

  return (
    <>
      <Head>
        {/* @NOTE: viewer */}
        <link rel="stylesheet" type="text/css" href="/lib/PDFViewCtrl.css" />

        {/* @NOTE: viewer */}
        <Script src="/lib/PDFViewCtrl.full.js" />
      </Head>
      {header}

      <div className="bg-[#F7F7F7] mobile:pt-[48px] pt-8 text-[#1D1D1D] !font-primaryB">
        <div className="bg-white fixed w-full bottom-0 left-0 flex justify-center mobile:hidden z-[1020] px-4 py-2">
          <PrimaryButton
            className="w-full max-w-[424px] !py-[17px] font-bold"
            onClick={() => onContinue()}
            data-testid="choose-plan-continue-button"
          >
            {t("payment_page.continue")}
          </PrimaryButton>
        </div>
        <div className="tablet:max-w-[1140px] mobile:max-w-[570px] mx-auto px-4 small-desktop:px-0">
          <div className="flex items-center justify-between tablet:mb-10">
            <h1
              className="mb-6 tablet:mb-0 text-[28px] leading-[30px] font-[900] tablet:text-[39px]
                tablet:leading-[54px] mobile:mx-auto tablet:mx-0 text-center mobile:text-start"
              data-testid="choose-plan-headline"
            >
              {t("payment_page.choose_plan")}
            </h1>
            <PrimaryButton
              className="hidden mobile:block w-[273px] !text-[20px] !leading-[30px] !py-4 !rounded-[12px] font-bold"
              onClick={() => onContinue()}
            >
              {t("payment_page.continue")}
            </PrimaryButton>
          </div>

          <div className="pb-[150px] tablet:pb-[200px]">
            <div className="tablet:flex tablet:gap-x-4 max-w-[1140px] mx-auto">
              <div className="max-w-[466px] w-full">
                <div className="relative hidden tablet:flex items-center justify-center bg-[#EBE7F5] px-[81px] py-10 rounded-[10px] tablet:min-h-[500px]">
                  {isImageLoading && (
                    <div className="w-[400px]">
                      <LoadingAnimation currentState="loading" />
                    </div>
                  )}
                  <BannerYourDocIsReady />
                  {previewImage}
                </div>
                <Rating />
              </div>
              <div className="max-w-[658px] w-full mobile:max-w-full">
                {plans.map((plan, id) => (
                  <div
                    key={id}
                    className={getClassNames(plan.id)}
                    onClick={() => onSelectPlan(plan.id)}
                  >
                    {plan.id === PaymentPlanId.MONTHLY_FULL && (
                      <div
                        className="flex justify-center items-center w-full bg-[#FFD9A5] text-[10px] leading-[12px]
                      tablet:text-[12px] tablet:leading-[18px] py-1 absolute top-0 left-0 rounded-[12px_12px_0_0] font-bold"
                      >
                        <Image
                          src={black_star}
                          alt="black_star"
                          className="mr-[3px] tablet:mr-[5px]"
                        />
                        <p>{t("payment_page.most_popular")}</p>
                      </div>
                    )}

                    {(isSecondEmail || isThirdEmail) &&
                      plan.id !== PaymentPlanId.ANNUAL && (
                        <div
                          className="flex justify-center items-center w-full bg-[#FF6A48] text-[#FFFFFF] text-[11px] leading-[18px]
                      tablet:text-[16px] tablet:leading-[22px] tablet:py-1 absolute top-0 left-0 rounded-[10px_10px_0_0] font-medium"
                        >
                          <p>{t("payment_page.discount_for_monthly")}</p>
                        </div>
                      )}

                    <div className="flex items-center justify-between text-[15px] tablet:text-[25px] font-semibold leading-[18px] tablet:leading-[30px]">
                      <div className="flex items-center">
                        <Image
                          src={selectedPlan === plan.id ? radio_on : radio_off}
                          alt={
                            selectedPlan === plan.id ? "radio_on" : "radio_off"
                          }
                          className="w-6 tablet:w-7 mr-2 tablet:mr-4 cursor-pointer"
                        />

                        <h4 className="font-[600]">
                          {plan.id === PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL
                            ? t("payment_page.plans.monthly_full.title_premium")
                            : plan.title}
                        </h4>
                      </div>
                      <span className="text-[18px] tablet:text-[25px] leading-[24px] tablet:leading-[25px] font-[800]">
                        {formatAmount(plan.price)}
                        <span className="text-[14px] tablet:text-[18px] leading-[18px] tablet:leading-[24px] font-[400]">
                          {plan.date}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
                <div className="tablet:hidden my-4">
                  <div className="bg-[#EBE7F5] min-h-[390px] flex items-center justify-center px-[60px] py-[24px] rounded-[10px] relative">
                    <BannerYourDocIsReady />
                    {previewImage}
                  </div>
                </div>
                {selectedPlan === currentPlan.id && (
                  <>
                    <ul className="mobile:flex mobile:flex-col mobile:flex-wrap mobile:max-h-[144px]">
                      {currentPlan.bullets.map((point, inx) => (
                        <li
                          key={inx}
                          className="text-[14px] tablet:text-[16px] leading-[18px] tablet:leading-[24px] font-[600] mb-3 last:mb-0 flex gap-x-2 mobile:items-center"
                        >
                          <Image
                            src={point.isIncluded ? check : cross}
                            alt="point"
                          />
                          {point.bullText}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[14px] tablet:text-[17px] leading-[18px] tablet:leading-[24px] mt-4 tablet:mt-8 text-[#575757]">
                      {currentPlan.id === PaymentPlanId.ANNUAL ? (
                        <>{currentPlan.text}</>
                      ) : (
                        <>
                          {!isSecondEmail && !isThirdEmail && (
                            <>{currentPlan.text}</>
                          )}
                          {(isSecondEmail || isThirdEmail) && (
                            <>
                              {" "}
                              After 7 days, auto-renews{" "}
                              <s>
                                {currentPlan.formattedCurrency}
                                {currentPlan.fullPrice === "€17.49"
                                  ? 34.99
                                  : 49.99}
                              </s>{" "}
                              {currentPlan.fullPrice} billed every month. Cancel
                              anytime.
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </>
                )}

                <p className="text-[14px] leading-[18px] tablet:text-[17px] tablet:leading-[28px] text-[#575757]">
                  <span className="font-[700]">
                    {t("payment_page.refund_description_1")}
                  </span>{" "}
                  <span>{t("payment_page.refund_description_2")}</span>{" "}
                  <a
                    href="mailto:support@pdfmaster.app"
                    className="text-[#575757]"
                  >
                    support@pdfmaster.app
                  </a>
                  {", "}
                  <span>{t("payment_page.refund_description_3")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
