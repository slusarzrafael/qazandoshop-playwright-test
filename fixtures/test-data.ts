import type { BillingData } from '../pages/CheckoutPage';
import type { ContactData } from '../pages/ContactPage';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ${name} não definida. Copie .env.example para .env.`);
  return value;
}

export const credentials = {
  get email() {
    return required('USER_EMAIL');
  },
  get password() {
    return required('USER_PASSWORD');
  },
  get name() {
    return process.env.USER_NAME || 'Usuário QA';
  },
};

export const uniqueEmail = () => `user_${Date.now()}_${Math.floor(Math.random() * 1e4)}@teste.com`;

export const invalidEmails = ['invalido', 'a@b', 'user@teste', 'user.teste.com'];

export const messages = {
  login: {
    invalidEmail: 'E-mail inválido.',
    invalidPassword: 'Senha inválida.',
    successTitle: 'Login realizado',
    successText: (email: string) => `Olá, ${email}`,
  },
  register: {
    nameRequired: 'O campo nome deve ser prenchido',
    emailInvalid: 'O campo e-mail deve ser prenchido corretamente',
    passwordShort: 'O campo senha deve ter pelo menos 6 dígitos',
    successTitle: 'Cadastro realizado!',
    successText: (name: string) => `Bem-vindo ${name}`,
  },
  logout: { title: 'Logout Sucessfull', text: 'Thank You' },
  product: {
    cartOk: ['Success!', 'Successfully added to your Cart'],
    cartDuplicated: ['Failed!', 'This product is already added in your Cart'],
    wishlistOk: ['Success', 'Added to Wishlist'],
    wishlistDuplicated: ['Failed', 'Already Added in Wishlist'],
    compareOk: ['Success!', 'Successfully added to Compare List'],
    compareDuplicated: ['Failed!', 'Already Added in Compare List'],
    minQuantity: ['Sorry!', 'Minimun Quantity Reached'],
  },
  cart: { invalidCoupon: ['Error!!', 'Invalid Cuppon Code'] },
  checkout: {
    required: [
      'O campo First Name deve ser prenchido',
      'O campo Last Name deve ser prenchido',
      'O campo Company deve ser prenchido',
      'O campo E-mail deve ser prenchido ou é inválido',
      'O campo Country deve ser prenchido',
      'O campo City deve ser prenchido',
      'O campo Zip Code deve ser prenchido',
      'O campo Address deve ser prenchido',
      'O campo Additional Notes deve ser prenchido',
    ],
    emailInvalid: 'O campo E-mail deve ser prenchido ou é inválido',
    paymentRequired: 'Preencha os dados de pagamento!',
  },
  search: ['Success', 'Check out the Results'],
  newsletter: ['Success', 'Thank you for your Subscribtion'],
  contact: ['Thank You', 'We Got Your Message'],
} as const;

export const products = {
  greenDress: { id: 1, name: 'Green Dress For Woman', price: '$38.00' },
  tShirt: { id: 2, name: 'T-Shirt For Men', price: '$72.00' },
  vNeck: { id: 3, name: 'V-Neck Dress', price: '$34.00' },
  fitFlare: { id: 5, name: 'Fit-Flare Dress', price: '$52.00' },
};

/** State the app ships with on every fresh load (no persistence). */
export const initialState = {
  cart: ['Fit-Flare Dress', 'Midi Dress', 'Tulip Dress'],
  cartSubtotal: '$107.00',
  wishlist: ['Boho Tops for Girls', 'Skater Dress', 'Rocking Chair', 'Easy Chair'],
  compare: ['Green Dress For Woman', 'T-Shirt For Men'],
};

export const billing: BillingData = {
  firstName: 'Rafael',
  lastName: 'QA',
  company: 'QAZANDO',
  email: 'checkout@teste.com',
  country: 'usa',
  city: 'Aland Islands',
  zip: '12345',
  address: 'Rua dos Testes, 100',
  notes: 'Entregar no período da tarde',
};

export const contact: ContactData = {
  name: 'Rafael QA',
  email: 'contato@teste.com',
  phone: '11999999999',
  subject: 'Dúvida sobre pedido',
  message: 'Mensagem enviada pela automação.',
};
