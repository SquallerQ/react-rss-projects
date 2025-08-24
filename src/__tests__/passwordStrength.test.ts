import { getPasswordStrength } from '../utils/passwordStrength';

describe('getPasswordStrength', () => {
  test('returns Weak for simple password', () => {
    expect(getPasswordStrength('abc')).toEqual({
      text: 'Weak',
      className: 'strength-weak',
    });
  });

  test('returns Medium for password with two criteria', () => {
    expect(getPasswordStrength('Abc1')).toEqual({
      text: 'Medium',
      className: 'strength-medium',
    });
  });

  test('returns Strong for password with all criteria', () => {
    expect(getPasswordStrength('Abc1!')).toEqual({
      text: 'Strong',
      className: 'strength-strong',
    });
  });

  test('returns Weak for empty password', () => {
    expect(getPasswordStrength('')).toEqual({
      text: 'Weak',
      className: 'strength-weak',
    });
  });
});
