import { FC, FormEvent, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormStore } from '../../store';

import { getPasswordStrength } from '../../utils/passwordStrength';
import { validationSchema } from '../../utils/validationSchema';
import type {
  FormData as FormDataType,
  FormErrors,
} from '../../types/formTypes';

import '../../styles/FormStyles.css';

const UncontrolledForm: FC<{
  focusRef?: React.RefObject<HTMLInputElement | null>;
}> = ({ focusRef }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    text: string;
    className: string;
  }>({ text: '', className: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { countries, addFormData } = useFormStore();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPasswordStrength(getPasswordStrength(password));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data: FormDataType = {
      name: formData.get('name') as string,
      age: formData.get('age') ? Number(formData.get('age')) : null,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      gender: formData.get('gender') as string,
      acceptTerms: formData.get('acceptTerms') === 'on',
      picture: '',
      country: formData.get('country') as string,
    };

    const pictureFile = formData.get('picture') as File;
    if (pictureFile && pictureFile.size > 0) {
      if (!['image/png', 'image/jpeg'].includes(pictureFile.type)) {
        setErrors({ picture: 'Image must be PNG or JPEG' });
        return;
      }
      if (pictureFile.size > 5 * 1024 * 1024) {
        setErrors({ picture: 'Image size must be less than 5MB' });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        data.picture = reader.result as string;
        validateAndSubmit(data);
      };
      reader.readAsDataURL(pictureFile);
    } else {
      validateAndSubmit({ ...data, picture: '' });
    }
  };

  const validateAndSubmit = async (data: FormDataType) => {
    try {
      const validatedData = await validationSchema.validate(data, {
        abortEarly: false,
      });
      setErrors({});

      addFormData({
        name: validatedData.name,
        age: Number(validatedData.age),
        email: validatedData.email,
        password: validatedData.password,
        confirmPassword: validatedData.confirmPassword,
        gender: validatedData.gender,
        acceptTerms: Boolean(validatedData.acceptTerms),
        picture:
          typeof validatedData.picture === 'string'
            ? validatedData.picture
            : '',
        country: validatedData.country,
      });

      const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(closeEvent);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: FormErrors = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path as keyof FormErrors] = error.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      <h2>Uncontrolled Form</h2>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" ref={focusRef} />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input type="number" id="age" name="age" />
        {errors.age && <span className="error">{errors.age}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            onChange={handlePasswordChange}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {passwordStrength.text && (
          <span className={`strength ${passwordStrength.className}`}>
            Strength: {passwordStrength.text}
          </span>
        )}
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="error">{errors.confirmPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label>Gender</label>
        <div className="radio-group">
          <label>
            <input type="radio" name="gender" value="male" />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="female" />
            Female
          </label>
        </div>
        {errors.gender && <span className="error">{errors.gender}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="acceptTerms">
          <input type="checkbox" id="acceptTerms" name="acceptTerms" />I accept
          the Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <span className="error">{errors.acceptTerms}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="picture">Upload Picture</label>
        <input
          type="file"
          id="picture"
          name="picture"
          accept="image/png,image/jpeg"
        />
        {errors.picture && <span className="error">{errors.picture}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <select id="country" name="country">
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && <span className="error">{errors.country}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledForm;
