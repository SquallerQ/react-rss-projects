import { create } from 'zustand';

interface FormData {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  acceptTerms: boolean;
  picture: string;
  country: string;
  id: number;
  isNew: boolean;
}

interface FormState {
  forms: FormData[];
  countries: string[];
  addFormData: (data: Omit<FormData, 'id' | 'isNew'>) => void;
  markAsRead: (id: number) => void;
}

export const useFormStore = create<FormState>((set) => ({
  forms: [],
  countries: [
    'USA',
    'Belarus',
    'Germany',
    'France',
    'Russia',
    'Ukraine',
    'Poland',
    'Spain',
    'Italy',
  ],
  addFormData: (data) =>
    set((state) => {
      const newData = { ...data, id: Date.now(), isNew: true };
      return { forms: [...state.forms, newData] };
    }),
  markAsRead: (id) =>
    set((state) => ({
      forms: state.forms.map((item) =>
        item.id === id ? { ...item, isNew: false } : item
      ),
    })),
}));
