import { InputValidationException } from "../../common/exceptions/input-validation-exception";

export function validateUserData(data: { email: string; password: string }): {
  email: string;
  password: string;
} {
  if (!data.email || !isValidEmail(data.email)) {
    throw new InputValidationException("Invalid email");
  }
  if (!data.password || !isValidPassword(data.password)) {
    throw new InputValidationException(
      "Password must be at least 6 characters long"
    );
  }

  return data;
}
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export function validateLimitParam(limitParam: string) {
  const limit = parseInt(limitParam, 10) || 5;

  if (isNaN(limit) || limit <= 0) {
    return {
      isValid: false,
      error: "Invalid limit parameter. It must be a positive number.",
      limit: 5
    };
  }

  return { isValid: true, limit };
}
