import { FC, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useFormStore } from '../../store';
import '../../styles/FormStyles.css';

interface FormData {
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
    .required('Age is required')
    .nullable(),
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

const HookForm: FC<{ focusRef?: React.RefObject<HTMLInputElement | null> }> = ({
  focusRef,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    text: string;
    className: string;
  }>({ text: '', className: '' });
  const { countries, addFormData } = useFormStore();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      acceptTerms: false,
      picture: '',
      country: '',
    },
  });

  const password = watch('password');

  useState(() => {
    if (password) {
      setPasswordStrength(getPasswordStrength(password));
    } else {
      setPasswordStrength({ text: '', className: '' });
    }
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setError('picture', { message: 'Image must be PNG or JPEG' });
        onChange('');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('picture', { message: 'Image size must be less than 5MB' });
        onChange('');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange('');
    }
  };

  const onSubmit = (data: FormData) => {
    addFormData({
      ...data,
      age: data.age ?? 0,
    });
    const closeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(closeEvent);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>React Hook Form</h2>

      <div className="form-group">
        <label htmlFor="hookform-name">Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input type="text" id="hookform-name" {...field} ref={focusRef} />
          )}
        />
        {errors.name && <span className="error">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="hookform-age">Age</label>
        <Controller
          name="age"
          control={control}
          render={({ field }) => (
            <input
              type="number"
              id="hookform-age"
              {...field}
              value={field.value ?? ''}
              onChange={(e) =>
                field.onChange(Number(e.target.value) || undefined)
              }
            />
          )}
        />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="hookform-email">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input type="email" id="hookform-email" {...field} />
          )}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="hookform-password">Password</label>
        <div className="input-group">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                type={showPassword ? 'text' : 'password'}
                id="hookform-password"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  setPasswordStrength(getPasswordStrength(e.target.value));
                }}
              />
            )}
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
        {errors.password && (
          <span className="error">{errors.password.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hookform-confirmPassword">Confirm Password</label>
        <div className="input-group">
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="hookform-confirmPassword"
                {...field}
              />
            )}
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
          <span className="error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <div className="form-group">
        <label>Gender</label>
        <div className="radio-group">
          <label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  value="male"
                  checked={field.value === 'male'}
                  onChange={() => field.onChange('male')}
                />
              )}
            />
            Male
          </label>
          <label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <input
                  type="radio"
                  value="female"
                  checked={field.value === 'female'}
                  onChange={() => field.onChange('female')}
                />
              )}
            />
            Female
          </label>
        </div>
        {errors.gender && (
          <span className="error">{errors.gender.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hookform-acceptTerms">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="hookform-acceptTerms"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          I accept the Terms and Conditions
        </label>
        {errors.acceptTerms && (
          <span className="error">{errors.acceptTerms.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hookform-picture">Upload Picture</label>
        <Controller
          name="picture"
          control={control}
          render={({ field }) => (
            <input
              type="file"
              id="hookform-picture"
              accept="image/png,image/jpeg"
              onChange={(e) => handleFileChange(e, field.onChange)}
            />
          )}
        />
        {errors.picture && (
          <span className="error">{errors.picture.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="hookform-country">Country</label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <select id="hookform-country" {...field}>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
        />
        {errors.country && (
          <span className="error">{errors.country.message}</span>
        )}
      </div>

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};

export default HookForm;
