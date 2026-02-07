export interface FormData {
  name: string;
  age: number | null;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  acceptTerms: boolean;
  picture: string;
  country: string;
}

export interface FormErrors {
  name?: string;
  age?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  acceptTerms?: string;
  picture?: string;
  country?: string;
}
