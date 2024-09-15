import { Link } from 'react-router-dom';
import { SignupForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export function Signup() {
  return (
    <AuthPageLayout>
      <SignupForm />
      <br />
      <span className='text-sm font-medium text-gray-400'>
        I already have an account (
        <Link to='/login' className='underline text-yellow-500'>
          go to login
        </Link>
        ).
      </span>
      <br />
    </AuthPageLayout>
  );
}
