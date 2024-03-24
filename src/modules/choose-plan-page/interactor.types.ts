import { RemoteConfig } from '../../providers/remote-config-provider';
import { User } from '../../providers/user-provider';
import { PaymentPlanId, Product } from '../../use-cases/get-subscription-products';

type Bullets = {
  imgSrc: string;
  bullText: JSX.Element;
};

export interface Plan {
  id: PaymentPlanId;
  title: string;
  price: string;
  date: string | null;
  bullets: Bullets[];
  bulletsC?: Bullets[];
  text: string | JSX.Element;
  formattedCurrency?: string;
  fullPrice?: string;
}

export type PaymentSubscriptionProductsHook = () => {products: Product[]};

export type PaymentUserHook = () => Pick<User, 'email' | 'subscription'>;

export type PaymentRemoteConfigHook = () => Pick<RemoteConfig, 'abTests' | 'isRemoteConfigLoading'>;

export type GetPlanHookArguments = {
  products: Product[];
}

export type GetPlansHook = (args: GetPlanHookArguments) => (t: (key: string) => string) => Plan[]