export const getPasswordStrength = (password: string): { text: string; className: string } => {
  let strength = 0;
  if (password.match(/([0-9])/)) strength += 1;
  if (password.match(/([A-Z])/)) strength += 1;
  if (password.match(/([a-z])/)) strength += 1;
  if (password.match(/([!@#$%^&*])/)) strength += 1;
  if (strength === 4) return { text: 'Strong', className: 'strength-strong' };
  if (strength >= 2) return { text: 'Medium', className: 'strength-medium' };
  return { text: 'Weak', className: 'strength-weak' };
};
