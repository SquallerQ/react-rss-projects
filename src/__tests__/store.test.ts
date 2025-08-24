import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from '../store';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({ forms: [] });
  });

  it('should mark form as read', () => {
    const formData = {
      name: 'Jane',
      age: 30,
      email: 'jane@test.com',
      password: 'password',
      confirmPassword: 'password',
      gender: 'female',
      acceptTerms: false,
      picture: 'jane.jpg',
      country: 'Germany',
    };

    useFormStore.getState().addFormData(formData);
    const addedForm = useFormStore.getState().forms[0];

    expect(addedForm.isNew).toBe(true);

    useFormStore.getState().markAsRead(addedForm.id);

    const updatedForm = useFormStore.getState().forms[0];
    expect(updatedForm.isNew).toBe(false);
  });
});
