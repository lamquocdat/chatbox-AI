import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import AIHubService from '../../../services/AIHubService';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { validateEmail, validatePassword } from '../../../utils/validation';

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const emailValidation = validateEmail(formData.email);
        const passwordValidation = validatePassword(formData.password);

        if (!emailValidation.isValid || !passwordValidation.isValid) {
            setErrors({
                email: emailValidation.error,
                password: passwordValidation.error,
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await AIHubService.login({
                email: formData.email,
                password: formData.password,
            });

            if (response.success && response.data) {
                localStorage.setItem('access_token', response.data.token);
                setAuth(response.data);
                navigate('/');
            } else {
                setErrors({ general: response.message || 'Login failed' });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setErrors({
                general: error?.response?.data?.message || 'An error occurred during login. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center w-full" style={{ backgroundColor: 'var(--background)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--primary)' }}>
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Sign in to your account to continue
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
                            autocompleteType="current-password"
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
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="text-sm hover:underline"
                            style={{ color: 'var(--primary)' }}
                            disabled={isLoading}
                        >
                            Forgot your password?
                        </button>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="font-medium hover:underline"
                                style={{ color: 'var(--primary)' }}
                                disabled={isLoading}
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
