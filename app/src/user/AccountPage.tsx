import type { User } from 'wasp/entities';
import {
  type SubscriptionStatus,
  prettyPaymentPlanName,
  parsePaymentPlanId
} from '../payment/plans';
import { Link } from 'wasp/client/router';
import { logout } from 'wasp/client/auth';
import { z } from 'zod';

export default function AccountPage({ user }: { user: User }) {
  return (
    <div className='py-16 lg:py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white min-h-screen'>
      <div className='container mx-auto px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-5xl font-bold tracking-tight text-white'>
            <span className='text-yellow-500'>Account</span> Information
          </h2>
        </div>
        <div className='my-12 bg-gray-800 rounded-3xl p-8 shadow-lg'>
          <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg mb-4 lg:m-8 dark:border-gray-100/10'>
            <div className='px-4 py-5 sm:px-6 lg:px-8'>
              <h3 className='text-base font-semibold leading-6 text-white'>Account Information</h3>
            </div>
            <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
              <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>
                {!!user.email && (
                  <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Email address</dt>
                    <dd className='mt-1 text-sm text-white sm:col-span-2 sm:mt-0'>{user.email}</dd>
                  </div>
                )}
                {!!user.username && (
                  <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                    <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Username</dt>
                    <dd className='mt-1 text-sm text-white sm:col-span-2 sm:mt-0'>{user.username}</dd>
                  </div>
                )}
                <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>Your Plan</dt>
                  <UserCurrentPaymentPlan  
                    subscriptionStatus={ user.subscriptionStatus as SubscriptionStatus} 
                    subscriptionPlan={ user.subscriptionPlan } 
                    datePaid={ user.datePaid }
                    credits={ user.credits }
                  />
                </div>
                <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>About</dt>
                  <dd className='mt-1 text-sm text-white sm:col-span-2 sm:mt-0'>
                    I'm a cool customer.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className='inline-flex w-full justify-end'>
            <button
              onClick={logout}
              className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type UserCurrentPaymentPlanProps = {
  subscriptionPlan: string | null
  subscriptionStatus: SubscriptionStatus | null
  datePaid: Date | null
  credits: number
}

function UserCurrentPaymentPlan({ subscriptionPlan, subscriptionStatus, datePaid, credits }: UserCurrentPaymentPlanProps) { 
  if (subscriptionStatus && subscriptionPlan && datePaid) {
    return (
      <>
        <dd className='mt-1 text-sm text-white sm:col-span-1 sm:mt-0'>
          {getUserSubscriptionStatusDescription({ subscriptionPlan, subscriptionStatus, datePaid })}
        </dd>
        {subscriptionStatus !== 'deleted' ? <CustomerPortalButton /> : <BuyMoreButton />}
      </>
    );
  }

  return (
    <>
      <dd className='mt-1 text-sm text-white sm:col-span-1 sm:mt-0'>
        Credits remaining: {credits}
      </dd>
      <BuyMoreButton />
    </>
  );
}

function getUserSubscriptionStatusDescription({
  subscriptionPlan,
  subscriptionStatus,
  datePaid,
}: {
  subscriptionPlan: string
  subscriptionStatus: SubscriptionStatus
  datePaid: Date;
}) {
  const planName = prettyPaymentPlanName(parsePaymentPlanId(subscriptionPlan));
  const endOfBillingPeriod = prettyPrintEndOfBillingPeriod(datePaid);
  return prettyPrintStatus(planName, subscriptionStatus, endOfBillingPeriod);
}

function prettyPrintStatus(planName: string, subscriptionStatus: SubscriptionStatus, endOfBillingPeriod: string): string {
  const statusToMessage: Record<SubscriptionStatus, string> = {
    active: `${planName}`,
    past_due: `Payment for your ${planName} plan is past due! Please update your subscription payment information.`,
    cancel_at_period_end: `Your ${planName} plan subscription has been canceled, but remains active until the end of the current billing period${endOfBillingPeriod}`,
    deleted: `Your previous subscription has been canceled and is no longer active.`,
  };
  if (Object.keys(statusToMessage).includes(subscriptionStatus)) {
    return statusToMessage[subscriptionStatus];
  } else {
    throw new Error(`Invalid subscriptionStatus: ${subscriptionStatus}`);
  }
}

function prettyPrintEndOfBillingPeriod(date: Date) {
  const oneMonthFromNow = new Date(date);
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
  return ': ' + oneMonthFromNow.toLocaleDateString();
}

function BuyMoreButton() {
  return (
    <div className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <Link to='/pricing' className='font-medium text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500'>
        Buy More/Upgrade
      </Link>
    </div>
  );
}

function CustomerPortalButton() {
  const handleClick = () => {
    try {
      const schema = z.string().url();
      const customerPortalUrl = schema.parse(import.meta.env.REACT_APP_STRIPE_CUSTOMER_PORTAL);
      window.open(customerPortalUrl, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='ml-4 flex-shrink-0 sm:col-span-1 sm:mt-0'>
      <button
        onClick={handleClick}
        className='font-medium text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300'
      >
        Manage Subscription
      </button>
    </div>
  );
}
