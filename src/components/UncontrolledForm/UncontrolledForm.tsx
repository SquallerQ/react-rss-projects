import { FC, FormEvent, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormStore } from '../../store';
import '../../styles/FormStyles.css';

interface FormData {
  name: string;
  age: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  acceptTerms: boolean;
  picture: string;
  country: string;
}

interface FormErrors {
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

const getPasswordStrength = (
  password: string
): { text: string; className: string } => {
  let strength = 0;
  if (password.match(/([0-9])/)) strength += 1;
  if (password.match(/([A-Z])/)) strength += 1;
  if (password.match(/([a-z])/)) strength += 1;
  if (password.match(/([!@#$%^&*])/)) strength += 1;
  if (strength === 4) return { text: 'Strong', className: 'strength-strong' };
  if (strength >= 2) return { text: 'Medium', className: 'strength-medium' };
  return { text: 'Weak', className: 'strength-weak' };
};

const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^[A-Z]/, 'Name must start with an uppercase letter')
    .matches(/^[a-zA-Z0-9]*$/, 'Name must contain only Latin characters')
    .required('Name is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .min(13, 'Age must be at least 13 years')
    .required('Age is required'),
  email: Yup.string()
    .email('Invalid email format')
    .matches(/^[a-zA-Z0-9@.]*$/, 'Email must contain only Latin characters')
    .required('Email is required'),
  password: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])/,
      'Password must contain at least one number, one uppercase letter, one lowercase letter, and one special character'
    )
    .matches(
      /^[a-zA-Z0-9!@#$%^&*]*$/,
      'Password must contain only Latin characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .matches(
      /^[a-zA-Z0-9!@#$%^&*]*$/,
      'Confirm password must contain only Latin characters'
    )
    .required('Required'),
  gender: Yup.string().required('Required'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('Required'),
  picture: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
});

const UncontrolledForm: FC = () => {
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
    const data: FormData = {
      name: formData.get('name') as string,
      age: formData.get('age') as string,
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

  const validateAndSubmit = async (data: FormData) => {
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
        <input type="text" id="name" name="name" />
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
