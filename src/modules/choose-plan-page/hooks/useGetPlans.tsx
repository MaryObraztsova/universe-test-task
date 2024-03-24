import { PaymentPlanId, Product } from '../../../use-cases/get-subscription-products';
import { Plan, GetPlansHook } from '../interactor.types';
import { getAnnualFormattedPrice, getCurrency, getTrialFormattedPrice } from '../../../shared/utils';
import { useMemo } from 'react';
import { BULLETS_BY_PLAN_ID } from '../interactor.config';

export const useGetPlans: GetPlansHook = ({products}) => (t) => {
  return useMemo(() => {
    return products.reduce<Plan[]>((acc, product: Product) => {
      if(product.name === PaymentPlanId.MONTHLY) {
        acc.push({
          id: product.name,
          title: t("payment_page.plans.monthly.title"),
          price: getTrialFormattedPrice({
            price: product.price.trial_price,
            currency: product.price.currency
          }),
          fullPrice: getTrialFormattedPrice({
            price: product.price.price,
            currency: product.price.currency
          }),
          formattedCurrency: getCurrency(product.price.currency),
          date: null,
          bullets: BULLETS_BY_PLAN_ID[PaymentPlanId.MONTHLY].map((bullet) => ({...bullet, bullText: t(bullet.bullText)})),
          text: t("payment_page.plans.monthly.text", {
            formattedPrice: getTrialFormattedPrice(
              {
                price: product.price.price,
              currency: product.price.currency
              }
            ),
          }),
        }) 
      }
  
      if(product.name === PaymentPlanId.MONTHLY_FULL) {
        acc.push({
          id: product.name,
          title: t("payment_page.plans.monthly_full.title"),
          price: getTrialFormattedPrice({
              price: product.price.trial_price,
            currency: product.price.currency
          }),
          fullPrice: getTrialFormattedPrice({
            price: product.price.price,
            currency: product.price.currency
          }),
          formattedCurrency: getCurrency(product.price.currency),
          date: null,
          bullets: BULLETS_BY_PLAN_ID[PaymentPlanId.MONTHLY_FULL].map((bullet) => ({...bullet, bullText: t(bullet.bullText)})),
          text: t("payment_page.plans.monthly_full.text", {
            formattedPrice: getTrialFormattedPrice({
              price: product.price.price,
              currency: product.price.currency
            }),
          }),
        })
      }
  
      if(product.name === PaymentPlanId.ANNUAL) {
        acc.push({
          id: product.name,
          title: t("payment_page.plans.annual.title"),
          price: getAnnualFormattedPrice({
            price: product.price.price,
            currency: product.price.currency
          }),
          date: t("payment_page.plans.annual.date"),
          bullets: BULLETS_BY_PLAN_ID[PaymentPlanId.ANNUAL].map((bullet) => ({...bullet, bullText: t(bullet.bullText)})),
          text: t("payment_page.plans.annual.text", {
            formattedPrice: getTrialFormattedPrice({
              price: product.price.price,
              currency: product.price.currency
            }),
          }),
        })
      }
  
      return acc
    },[])
  }, [products]);
  };
