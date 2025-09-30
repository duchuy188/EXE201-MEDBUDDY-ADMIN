// Small validation helpers used across forms

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email || !email.trim()) return 'Vui lòng nhập email';
  if (!EMAIL_REGEX.test(email.trim())) return 'Email không hợp lệ';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password || !password.trim()) return 'Vui lòng nhập mật khẩu';
  // Minimum 6 characters as a reasonable rule; adjust if your backend requires more.
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  return null;
}

export function validateLogin(email: string, password: string): string | null {
  const e = validateEmail(email);
  if (e) return e;
  const p = validatePassword(password);
  if (p) return p;
  return null;
}
