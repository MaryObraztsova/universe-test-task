import { Currencies, PaymentPlanId, Plan } from "../../types/interactor";
import { Product } from "../../use-cases/get-subscription-products";
import classNames from "classnames";
import { TFunction } from "i18next";

export const formatAmount = (fullPrice: string) =>
  fullPrice.charAt(0) + parseFloat(fullPrice.substring(1)).toFixed(2);

export const getCurrency = (currency: string) => Currencies[currency] ?? "€";

export const getTrialFormattedPrice = (price: number, currency: string) =>
  getCurrency(currency) + price / 100;

export const getAnnualFormattedPrice = (price: number, currency: string) => {
  if (price === 19900) {
    return `€${price / 100 / 12}`;
  }

  return getCurrency(currency) + price / 100 / 12;
};

const getBullJsx = (text: string, isGray: boolean = false) => {
  return (
    <span
      {...(isGray && {
        className: "text-[#878787]",
      })}
    >
      {text}
    </span>
  );
};

export const getPlans = (
  products: Product[],
  t: TFunction<"translation", undefined>
): Plan[] => {
  return [
    {
      id: products[0]?.name as PaymentPlanId,
      title: t("payment_page.plans.monthly.title"),
      price: getTrialFormattedPrice(
        products[0]?.price!.trial_price!,
        products[0]?.price!.currency
      ),
      fullPrice: getTrialFormattedPrice(
        products[0]?.price?.price,
        products[0]?.price?.currency
      ),
      formattedCurrency: getCurrency(products[0]?.price.currency),
      date: null,
      bullets: [
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet1")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet2")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet3")),
        },
        {
          isIncluded: false,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet4"), true),
        },
        {
          isIncluded: false,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet5"), true),
        },
        {
          isIncluded: false,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet6"), true),
        },
        {
          isIncluded: false,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet7"), true),
        },
        {
          isIncluded: false,
          bullText: getBullJsx(t("payment_page.plans.monthly.bullet8"), true),
        },
      ],
      text: t("payment_page.plans.monthly.text", {
        formattedPrice: getTrialFormattedPrice(
          products[0]?.price?.price,
          products[0]?.price?.currency
        ),
      }),
    },
    {
      id: products[1]?.name as PaymentPlanId,
      title: t("payment_page.plans.monthly_full.title"),
      price: getTrialFormattedPrice(
        products[1]?.price?.trial_price!,
        products[1]?.price?.currency
      ),
      fullPrice: getTrialFormattedPrice(
        products[1]?.price?.price,
        products[1]?.price?.currency
      ),
      formattedCurrency: getCurrency(products[1]?.price.currency),
      date: null,
      bullets: [
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet1")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet2")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet3")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet4")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet5")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet6")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet7")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.monthly_full.bullet8")),
        },
      ],
      text: t("payment_page.plans.monthly_full.text", {
        formattedPrice: getTrialFormattedPrice(
          products[1]?.price?.price,
          products[1]?.price?.currency
        ),
      }),
    },
    {
      id: products[2]?.name as PaymentPlanId,
      title: t("payment_page.plans.annual.title"),
      price: getAnnualFormattedPrice(
        products[2]?.price?.price,
        products[2]?.price?.currency
      ),
      date: t("payment_page.plans.annual.date"),
      bullets: [
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet1")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet2")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet3")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet4")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet5")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet6")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet7")),
        },
        {
          isIncluded: true,
          bullText: getBullJsx(t("payment_page.plans.annual.bullet8")),
        },
      ],
      text: t("payment_page.plans.annual.text", {
        formattedPrice: getTrialFormattedPrice(
          products[2]?.price?.price,
          products[2]?.price?.currency
        ),
      }),
    },
  ];
};

export const getClassNames = (id) =>
  classNames(
    "bg-[#FFFFFF] hover:cursor-pointer rounded-[12px] p-5 tablet:p-0 tablet:py-9 tablet:px-9 tablet:mb-4 mb-3 relative",
    {
      "p-0 tablet:py-0 pt-[26px] pb-[14px] tablet:pt-[44px] tablet:pb-[28px] px-5":
        id === PaymentPlanId.MONTHLY_FULL,
    },
    {
      "p-0 tablet:py-0 pt-[26px] pb-[14px] tablet:pt-[47px] tablet:pb-[19px] px-5":
        id === PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL,
    },
    {
      "p-0 tablet:py-0 pt-[26px] pb-[14px] tablet:pt-[47px] tablet:pb-[19px] px-5":
        id === PaymentPlanId.MONTHLY_SECOND_EMAIL,
    },
    {
      "p-0 tablet:py-0 pt-[26px] pb-[14px] tablet:pt-[47px] tablet:pb-[19px] px-5":
        id === PaymentPlanId.MONTHLY_FULL_THIRD_EMAIL,
    },
    {
      "p-0 tablet:py-0 pt-[26px] pb-[14px] tablet:pt-[47px] tablet:pb-[19px] px-5":
        id === PaymentPlanId.MONTHLY_THIRD_EMAIL,
    }
  );
