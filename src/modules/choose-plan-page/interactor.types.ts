import { TFunction } from 'i18next';
import { RemoteConfig } from '../../providers/remote-config-provider';
import { User } from '../../providers/user-provider';
import { PaymentPlanId, Product } from '../../use-cases/get-subscription-products';
import { ApiFile } from '../../services/api/types';

export type Bullet = {
  imgSrc: string;
  bullText: JSX.Element | string;
  bullClassName?: string;
};

export interface Plan {
  id: PaymentPlanId;
  title: string;
  price: string;
  date: string | null;
  bullets: Bullet[];
  bulletsC?: Bullet[];
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

export type GetPlansHook = (args: GetPlanHookArguments) => (t: TFunction) => Plan[]

export type ImagePdfHook = (file: ApiFile) => {imagePDF: Blob | null, isImageLoading: boolean};