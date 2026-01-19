/**
 * Input validation utilities for form data and user input.
 */

import { EMAIL_REGEX, DISPLAY_NAME_MAX_LENGTH, LEARNING_LIMITS } from '@/lib/constants';

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < LEARNING_LIMITS.MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: `Password must be at least ${LEARNING_LIMITS.MIN_PASSWORD_LENGTH} characters` };
  }

  return { isValid: true };
}

export function validatePasswordMatch(password: string, confirmPassword: string): {
  isValid: boolean;
  error?: string;
} {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
}

export function validateDisplayName(name: string): { isValid: boolean; error?: string } {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Display name is required' };
  }

  if (trimmed.length > DISPLAY_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or less`,
    };
  }

  // Allow alphanumeric and spaces
  if (!/^[a-zA-Z0-9\s]+$/.test(trimmed)) {
    return { isValid: false, error: 'Display name can only contain letters, numbers, and spaces' };
  }

  return { isValid: true };
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization to prevent XSS
  const element = document.createElement('div');
  element.textContent = input;
  return element.innerHTML;
}
