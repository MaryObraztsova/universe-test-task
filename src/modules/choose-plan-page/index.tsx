import { Header } from "../../header";
import { useRemoteConfig } from '../../providers/remote-config-provider';
import { useGetSubscriptionProducts } from "../../use-cases/get-subscription-products";
import { useUserPaymentInfo } from './hooks';
import { useGetPlans } from './hooks/useGetPlans';
import { usePaymentPageInteractor } from "./interactor";
import { interactorImagesFormat } from './interactor.config';
import { PaymentPageRouter } from "./router";
import React from "react";

export interface IProps {}
export const PaymentPage: React.FC<IProps> = () => {
	const interactor = usePaymentPageInteractor({
		useSubscriptionProductsHook: useGetSubscriptionProducts,
		useUserHook: useUserPaymentInfo,
		useRemoteConfigHook: useRemoteConfig,
    useGetPlansHook: useGetPlans,
    imagesFormat: interactorImagesFormat,
	});

  return (
    <PaymentPageRouter
      header={<Header backgroundColor="#FFF" />}
      interactor={interactor}
    />
  );
};
