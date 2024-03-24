import { Header } from "../../header";
import { useRemoteConfig } from '../../providers/remote-config-provider';
import { useGetSubscriptionProducts } from "../../use-cases/get-subscription-products";
import { useUserPaymentInfo } from './hooks';
import { usePaymentPageInteractor } from "./interactor";
import { PaymentPageRouter } from "./router";
import React from "react";

export interface IProps {}
export const PaymentPage: React.FC<IProps> = () => {
	const interactor = usePaymentPageInteractor({
		useSubscriptionProductsHook: useGetSubscriptionProducts,
		useUserHook: useUserPaymentInfo,
		useRemoteConfigHook: useRemoteConfig
	});

  return (
    <PaymentPageRouter
      header={<Header backgroundColor="#FFF" />}
      interactor={interactor}
    />
  );
};
