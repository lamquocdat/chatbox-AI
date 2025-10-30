export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
    if (!email) {
        return { isValid: false, error: 'Email is required' };
    }
    if (!email.endsWith('@hpt.vn')) {
        return { isValid: false, error: 'Email must end with @hpt.vn' };
    }
    return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }
    if (password.length < 6) {
        return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
        return { isValid: false, error: 'Please confirm your password' };
    }
    if (confirmPassword !== password) {
        return { isValid: false, error: 'Passwords do not match' };
    }
    return { isValid: true };
};
