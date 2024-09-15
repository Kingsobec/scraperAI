import { useAuth } from 'wasp/client/auth';
import { generateStripeCheckoutSession } from 'wasp/client/operations';
import { PaymentPlanId, paymentPlans, prettyPaymentPlanName } from './plans';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { cn } from '../client/cn';
import { z } from 'zod';

const bestDealPaymentPlanId: PaymentPlanId = PaymentPlanId.Pro;

interface PaymentPlanCard {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard> = {
  [PaymentPlanId.Hobby]: {
    name: prettyPaymentPlanName(PaymentPlanId.Hobby),
    price: '$9.99',
    description: '15 credits/month to access all AI tools',
    features: ['15 credits per month', 'Basic support', 'Access to all AI tools'],
  },
  [PaymentPlanId.Pro]: {
    name: prettyPaymentPlanName(PaymentPlanId.Pro),
    price: '$19.99',
    description: 'Unlimited usage of all tools',
    features: ['Unlimited monthly usage', 'Priority customer support', 'Access to all AI tools'],
  },
  [PaymentPlanId.Credits10]: {
    name: prettyPaymentPlanName(PaymentPlanId.Credits10),
    price: '$9.99',
    description: 'One-time purchase of 10 credits for your account',
    features: ['Use credits for e.g. OpenAI API calls', 'No expiration date'],
  },
};

const PricingPage = () => {
  const [isStripePaymentLoading, setIsStripePaymentLoading] = useState<boolean | string>(false);

  const { data: user, isLoading: isUserLoading } = useAuth();
  const history = useHistory();

  async function handleBuyNowClick(paymentPlanId: PaymentPlanId) {
    if (!user) {
      history.push('/login');
      return;
    }
    try {
      setIsStripePaymentLoading(paymentPlanId);
      let stripeResults = await generateStripeCheckoutSession(paymentPlanId);

      if (stripeResults?.sessionUrl) {
        window.open(stripeResults.sessionUrl, '_self');
      }
    } catch (error: any) {
      console.error(error?.message ?? 'Something went wrong.');
    } finally {
      setIsStripePaymentLoading(false);
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      history.push('/login');
      return;
    }
    try {
      const schema = z.string().url();
      const customerPortalUrl = schema.parse(import.meta.env.REACT_APP_STRIPE_CUSTOMER_PORTAL);
      window.open(customerPortalUrl, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-16 lg:py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white min-h-screen">
      <div className="container mx-auto px-6 lg:px-8">
        <div id="pricing" className="text-center">
          <h2 className="text-5xl font-bold tracking-tight text-white">
            Choose Your <span className="text-yellow-500">Plan</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            Unlock the full power of our AI tools. Choose the plan that suits you best and start automating your workflow today!
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid grid-cols-1 gap-y-8 lg:gap-x-8 sm:mt-20 lg:grid-cols-3 max-w-4xl">
          {Object.values(PaymentPlanId).map((planId) => (
            <div
              key={planId}
              className={cn(
                'relative flex flex-col grow justify-between rounded-3xl ring-2 ring-gray-800 overflow-hidden p-8 shadow-lg transform transition-all duration-300 hover:scale-105',
                {
                  'bg-gradient-to-br from-yellow-400 to-purple-500': planId === bestDealPaymentPlanId,
                  'bg-gray-800': planId !== bestDealPaymentPlanId,
                }
              )}
            >
              <div className="mb-8">
                <h3 id={planId} className="text-2xl font-semibold leading-8 text-white">
                  {paymentPlanCards[planId].name}
                </h3>
                <p className="mt-4 text-lg leading-6 text-gray-300">
                  {paymentPlanCards[planId].description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {paymentPlanCards[planId].price}
                  </span>
                  <span className="text-lg font-semibold leading-6 text-gray-400">
                    {paymentPlans[planId].effect.kind === 'subscription' && '/month'}
                  </span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-lg leading-6 text-gray-300">
                  {paymentPlanCards[planId].features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <AiFillCheckCircle className="h-6 w-6 flex-none text-yellow-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {!!user && !!user.subscriptionStatus ? (
                <button
                  onClick={handleCustomerPortalClick}
                  aria-describedby="manage-subscription"
                  className={cn(
                    'mt-8 block rounded-md py-3 px-6 text-center text-lg font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400',
                    {
                      'bg-yellow-500 text-white hover:bg-yellow-400': planId === bestDealPaymentPlanId,
                      'bg-gray-700 text-white ring-1 ring-inset ring-gray-600 hover:ring-yellow-500': planId !== bestDealPaymentPlanId,
                    }
                  )}
                >
                  Manage Subscription
                </button>
              ) : (
                <button
                  onClick={() => handleBuyNowClick(planId)}
                  aria-describedby={planId}
                  className={cn(
                    {
                      'bg-yellow-500 text-white hover:bg-yellow-400': planId === bestDealPaymentPlanId,
                      'bg-gray-700 text-white ring-1 ring-inset ring-gray-600 hover:ring-yellow-500': planId !== bestDealPaymentPlanId,
                    },
                    {
                      'opacity-50 cursor-not-allowed': isStripePaymentLoading === planId,
                    },
                    'mt-8 block rounded-md py-3 px-6 text-center text-lg font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400'
                  )}
                >
                  {!!user ? 'Buy Plan' : 'Log in to Buy Plan'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
