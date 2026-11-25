import { SignInScreen } from '~/components/auth/SignInScreen';

export const meta = { title: 'Entrar', route: '(auth)/signin' };

export const states = {
  default: {},
  filled: { form: { email: 'ana.souza@email.com', password: 'segredo123' } },
};

export default SignInScreen;
