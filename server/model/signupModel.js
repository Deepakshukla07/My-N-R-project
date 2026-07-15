export class SignupModel {
  static validate(data) {
    const errors = {};

    // Name validation
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.name = 'Full Name is required.';
    }

    // Email validation
    if (!data.email || typeof data.email !== 'string') {
      errors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.email = 'Invalid email address format.';
      }
    }

    // Password validation
    if (!data.password || typeof data.password !== 'string') {
      errors.password = 'Password is required.';
    } else if (data.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    // Confirm Password validation (checked on signup/update)
    if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
