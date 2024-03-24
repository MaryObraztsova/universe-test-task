import { RemoteConfig } from '../../providers/remote-config-provider';
import { User } from '../../providers/user-provider';
import { Product } from '../../use-cases/get-subscription-products';

export type PaymentSubscriptionProductsHook = () => {products: Product[]};

export type PaymentUserHook = () => Pick<User, 'email' | 'subscription'>;

export type PaymentRemoteConfigHook = () => Pick<RemoteConfig, 'abTests' | 'isRemoteConfigLoading'>;