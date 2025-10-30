import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateEmail = (email: string): boolean => {
        if (!email) {
            setErrors(prev => ({ ...prev, email: 'Email is required' }));
            return false;
        }
        if (!email.endsWith('@hpt.vn')) {
            setErrors(prev => ({ ...prev, email: 'Email must end with @hpt.vn' }));
            return false;
        }
        setErrors(prev => ({ ...prev, email: undefined }));
        return true;
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.email) {
            validateEmail(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validateEmail(email)) {
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implement forgot password API call
            // const response = await AIHubService.forgotPassword({ email });

            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Forgot password error:', error);
            setErrors({
                general: error?.response?.data?.message || 'An error occurred. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-green-500">
                            <KeyRound className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                            Check Your Email
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            We've sent password reset instructions to <br />
                            <span className="font-medium">{email}</span>
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border" style={{ borderColor: 'var(--border)' }}>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <p className="text-sm text-green-600 dark:text-green-400 text-center">
                                    Please check your email inbox and follow the instructions to reset your password.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all hover:opacity-90"
                                style={{ backgroundColor: 'var(--primary)' }}
                            >
                                Back to Sign In
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-sm hover:underline"
                                style={{ color: 'var(--primary)' }}
                            >
                                Didn't receive the email? Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'var(--primary)' }}>
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                        Forgot Password?
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        No worries, we'll send you reset instructions
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border dark:border-none" style={{ borderColor: 'var(--border)' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                placeholder="your.name@hpt.vn"
                                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                                style={{
                                    borderColor: errors.email ? '#ef4444' : 'var(--border)',
                                    backgroundColor: 'var(--input)'
                                }}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* General Error */}
                        {errors.general && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: 'var(--primary)' }}
                        >
                            {isLoading ? 'Sending...' : 'Reset Password'}
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:underline inline-flex items-center gap-1"
                            disabled={isLoading}
                        >
                            <ArrowLeft size={16} />
                            Back to Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
