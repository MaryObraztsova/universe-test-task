import { useUser } from '../../../providers/user-provider';
import { PaymentUserHook } from '../interactor.types';
import { useMemo } from 'react';

export const useUserPaymentInfo: PaymentUserHook = () => {
	const { user } = useUser();

	return useMemo(
		() => ({
			email: user.email,
			subscription: user.subscription
		}),
		[user]
	);
};
