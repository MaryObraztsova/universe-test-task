import React from 'react';
import { PaymentPlanId, Product } from '../../../use-cases/get-subscription-products';
import check from '../assets/check.svg';
import cross from '../assets/cross.svg';
import { Plan } from '../interface';

const getTrialFormattedPrice = (price: number, currency: string) => {
  if (currency === "USD") {
    return `$${price / 100}`;
  }
  if (currency === "GBP") {
    return `£${price / 100}`;
  }

  return `€${price / 100}`;
};

const getAnnualFormattedPrice = (price: number, currency: string) => {
  const num = (price / 100 / 12).toFixed(2)

  if (price === 19900) {
    return `€${num}`;
  }

  switch (currency) {
    case "USD":
      return `$${num}`;
    case "GBP":
      return `£${num}`;
    default:
      return `€${num}`;
  }
};

const getCurrency = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "GBP":
      return "£";
    default:
      return "€"
  }
};

const productsConvertToPlans = (products: Product[]) => (t: (key: string) => string): Plan[] => {
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
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.monthly.bullet1")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.monthly.bullet2")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.monthly.bullet3")}</span>,
        },
        {
          imgSrc: cross,
          bullText: (
            <span className="text-[#878787]">
                {t("payment_page.plans.monthly.bullet4")}
              </span>
          ),
        },
        {
          imgSrc: cross,
          bullText: (
            <span className="text-[#878787]">
                {t("payment_page.plans.monthly.bullet5")}
              </span>
          ),
        },
        {
          imgSrc: cross,
          bullText: (
            <span className="text-[#878787]">
                {t("payment_page.plans.monthly.bullet6")}
              </span>
          ),
        },
        {
          imgSrc: cross,
          bullText: (
            <span className="text-[#878787]">
                {t("payment_page.plans.monthly.bullet7")}
              </span>
          ),
        },
        {
          imgSrc: cross,
          bullText: (
            <span className="text-[#878787]">
                {t("payment_page.plans.monthly.bullet8")}
              </span>
          ),
        },
      ],
      //@ts-ignore
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
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet1")}</span>
          ),
        },
        {
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet2")}</span>
          ),
        },
        {
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet3")}</span>
          ),
        },
        {
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet4")}</span>
          ),
        },
        {
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet5")}</span>
          ),
        },
        {
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet6")}</span>
          ),
        },
        {
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet7")}</span>
          ),
        },
        {
          imgSrc: check,
          bullText: (
            <span>{t("payment_page.plans.monthly_full.bullet8")}</span>
          ),
        },
      ],
      // @ts-ignore
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
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet1")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet2")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet3")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet4")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet5")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet6")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet7")}</span>,
        },
        {
          imgSrc: check,
          bullText: <span>{t("payment_page.plans.annual.bullet8")}</span>,
        },
      ],
      // @ts-ignore
      text: t("payment_page.plans.annual.text", {
        formattedPrice: getTrialFormattedPrice(
          products[2]?.price?.price,
          products[2]?.price?.currency
        ),
      }),
    },
  ];
};

export default productsConvertToPlans