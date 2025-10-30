import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import AIHubService from '../../../services/AIHubService';
import { EmailInput } from '../../login/components/EmailInput';
import { PasswordInput } from '../../login/components/PasswordInput';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../../utils/validation';

interface RegisterFormProps {
    onSuccess: (email: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setFormData(prev => ({ ...prev, email }));

        if (errors.email) {
            const validation = validateEmail(email);
            setErrors(prev => ({ ...prev, email: validation.error }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setFormData(prev => ({ ...prev, password }));

        if (errors.password) {
            const validation = validatePassword(password);
            setErrors(prev => ({ ...prev, password: validation.error }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPassword = e.target.value;
        setFormData(prev => ({ ...prev, confirmPassword }));

        if (errors.confirmPassword) {
            const validation = validateConfirmPassword(formData.password, confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: validation.error }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const emailValidation = validateEmail(formData.email);
        const passwordValidation = validatePassword(formData.password);
        const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);

        if (!emailValidation.isValid || !passwordValidation.isValid || !confirmPasswordValidation.isValid) {
            setErrors({
                email: emailValidation.error,
                password: passwordValidation.error,
                confirmPassword: confirmPasswordValidation.error,
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await AIHubService.register({
                email: formData.email,
                password: formData.password,
            });

            if (response.success) {
                onSuccess(formData.email);
            } else {
                setErrors({ general: response.message || 'Registration failed' });
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setErrors({
                general: error?.response?.data?.message || 'An error occurred during registration. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--primary)' }}>
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                        Create Account
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Sign up to get started with HPT PC Assistant
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border dark:border-none" style={{ borderColor: 'var(--border)' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <EmailInput
                            value={formData.email}
                            onChange={handleEmailChange}
                            error={errors.email}
                            disabled={isLoading}
                        />

                        <PasswordInput
                            value={formData.password}
                            onChange={handlePasswordChange}
                            error={errors.password}
                            disabled={isLoading}
                            placeholder="At least 6 characters"
                        />

                        <PasswordInput
                            value={formData.confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={errors.confirmPassword}
                            disabled={isLoading}
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            autocompleteType="new-password"
                        />

                        {errors.general && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-medium hover:underline"
                                style={{ color: 'var(--primary)' }}
                                disabled={isLoading}
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
