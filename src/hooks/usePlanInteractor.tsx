import { useRemoteConfig } from "../providers/remote-config-provider";
import { useUser } from "../providers/user-provider";
import { API } from "../services/api";
import { PAGE_LINKS, PaymentPlanId, Plan } from "../types/interactor";
import { useGetSubscriptionProducts } from "../use-cases/get-subscription-products";
import { getPlans } from "../utils/choose-plan-page";
import { TFunction } from "i18next";
import { useRouter } from "next/router";
import React from "react";

export interface IUsePlanInteractor {
  selectedPlan: PaymentPlanId;
  isEditorFlow: boolean;
  isSecondEmail: boolean;
  isThirdEmail: boolean;
  isRemoteConfigLoading: boolean;
  isPlansLoading: boolean;
  onSelectPlan: (plan: PaymentPlanId) => void;
  onContinue: (place?: string) => void;
  onCommentsFlip: () => void;
  getPlans: (t: TFunction<"translation", undefined>) => Plan[];
}

export const usePlanInteractor = (): IUsePlanInteractor => {
  const router = useRouter();
  const { user } = useUser();
  const { products } = useGetSubscriptionProducts();
  const { abTests, isRemoteConfigLoading } = useRemoteConfig();

  const [selectedPlan, setSelectedPlan] = React.useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );

  const onCommentsFlip = () => {
    console.log("send event analytic0");
  };

  const onSelectPlan = (plan: PaymentPlanId) => {
    if (selectedPlan === plan) {
      setSelectedPlan(plan);
      onContinue("planTab");

      return;
    }
    setSelectedPlan(plan);
    const product = products?.find((item) => item.name === plan);

    console.log(
      "send event analytic1",
      "productId: ",
      plan,
      "currency: ",
      product?.price?.currency || "USD",
      "value: ",
      (product?.price?.price || 0) / 100
    );
  };

  const onContinue = (place?: string) => {
    console.log(
      "send event analytic2",
      "place: ",
      place ? place : "button",
      "planName: ",
      selectedPlan
    );

    localStorage.setItem("selectedPlan", selectedPlan);

    router.push({ pathname: `${PAGE_LINKS.PAYMENT}`, query: router.query });
  };

  React.useEffect(() => {
    if (user?.subscription !== null) {
      router.push(`${PAGE_LINKS.DASHBOARD}`);
    }

    if (!user?.email) {
      router.back();

      return;
    }

    if (user?.email !== null) {
      return;
    }

    if (router.query?.token) {
      API.auth.byEmailToken(router.query.token as string);
    }
  }, [user?.subscription, user?.email, router.query?.token]);

  // @NOTE: analytics on page rendered
  React.useEffect(() => {
    if (!localStorage.getItem("select_plan_view")) {
      console.log("send event analytic3");
    }

    localStorage.setItem("select_plan_view", "true");

    return () => {
      localStorage.removeItem("select_plan_view");
    };
  }, []);

  // @NOTE: setting pre-select plan for users from remarketing emails
  React.useEffect(() => {
    if (router.query?.fromEmail === "true") {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
      return;
    }
  }, [abTests]);

  return {
    selectedPlan,
    isEditorFlow:
      (router.query?.source === "editor" ||
        router.query?.source === "account") &&
      router.query.convertedFrom === undefined,
    isSecondEmail: router.query?.fromEmail === "true",
    isThirdEmail: router.query?.fromEmail === "true",
    isRemoteConfigLoading,
    isPlansLoading: !products.length,
    onSelectPlan,
    onContinue,
    onCommentsFlip,
    getPlans: (t) => getPlans(products, t),
  };
};
