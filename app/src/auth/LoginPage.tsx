import { Link } from 'react-router-dom';
import { LoginForm } from 'wasp/client/auth';
import { AuthPageLayout } from './AuthPageLayout';

export default function Login() {
  return (
    <AuthPageLayout>
      <LoginForm />
      <br />
      <span className='text-sm font-medium text-gray-400'>
        Don't have an account yet?{' '}
        <Link to='/signup' className='underline text-yellow-500'>
          go to signup
        </Link>
        .
      </span>
      <br />
      <span className='text-sm font-medium text-gray-400'>
        Forgot your password?{' '}
        <Link to='/request-password-reset' className='underline text-yellow-500'>
          reset it
        </Link>
        .
      </span>
    </AuthPageLayout>
  );
}
