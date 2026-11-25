import { useMemo } from 'react';

import { useConsultationCheckoutQuote } from '~/hooks/checkout/useConsultationCheckoutQuote';
import { useActivePatientId } from '~/hooks/profile/useActiveProfile';
import { useUserProfile } from '~/hooks/profile/useMe';
import { cardDefaultsFrom } from '~/lib/checkout/card';
import type { PaymentMethod } from '~/lib/checkout/phase';
import { canUseWalletOnCall } from '~/lib/checkout/quote';
import { checkoutTotals, companyCreditBalance, companyCreditCoversTotal } from '~/lib/checkout/summary';
import type { ConsultationChannelType } from '~/lib/scheduling/appointment';

// Same values as the app hook, with the socket treated as connected.
export function usePlantaoSession(channel: ConsultationChannelType, method: PaymentMethod | null) {
  const { profile, user } = useUserProfile();
  const patientId = useActivePatientId();
  const quote = useConsultationCheckoutQuote({ flow: 'on_call', useWalletCredit: method === 'wallet', sharedCoupon: true });
  const totals = checkoutTotals(quote.summary, null);
  const walletBalance = profile?.wallet_balance ? Number.parseFloat(profile.wallet_balance) : 0;
  const companyCredit = companyCreditBalance(profile?.credit);
  const cardDefaults = useMemo(() => cardDefaultsFrom(profile), [profile]);
  return {
    ready: Boolean(patientId && user?.email),
    patientId: patientId ?? '',
    patientEmail: user?.email ?? '',
    channel,
    quote,
    totals,
    walletBalance,
    walletAvailable: canUseWalletOnCall(walletBalance, totals.subtotal),
    companyCredit,
    companyCreditAvailable: companyCreditCoversTotal(companyCredit, totals),
    cardDefaults,
    profileKey: patientId ?? 'anon',
    connection: 'connected' as const,
    reconnect: async () => true,
  };
}
