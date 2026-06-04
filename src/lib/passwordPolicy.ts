const MIN_PASSWORD_LENGTH = 10;

export const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

export const PASSWORD_POLICY_MESSAGE =
  "Mật khẩu phải có ít nhất 10 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";

export const isStrongPassword = (password: string) =>
  typeof password === "string" &&
  password.length >= MIN_PASSWORD_LENGTH &&
  strongPasswordPattern.test(password);
