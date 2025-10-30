import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import AIHubService from '../../../services/AIHubService';
import { CodeInput } from './CodeInput';

interface VerificationFormProps {
    email: string;
    onBack: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({ email, onBack }) => {
    const navigate = useNavigate();

    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState<{ verification?: string; general?: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleVerificationCodeChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    // Hàm mới để set toàn bộ code cùng lúc (dùng cho paste)
    const handleSetFullCode = (fullCode: string[]) => {
        setVerificationCode(fullCode);
    };

    const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const code = verificationCode.join('');
        if (code.length !== 6) {
            setErrors({ verification: 'Please enter the complete 6-digit code' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await AIHubService.verify({
                email,
                code,
            });

            if (response.success) {
                navigate('/login', {
                    state: { message: 'Email verified successfully! Please login.' }
                });
            } else {
                setErrors({ verification: response.message || 'Verification failed' });
            }
        } catch (error: any) {
            console.error('Verification error:', error);
            setErrors({
                verification: error?.response?.data?.message || 'An error occurred during verification. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        setErrors({});

        try {
            const response = await AIHubService.resendCode({
                email,
            });

            if (response.success) {
                alert('Verification code resent successfully!');
            } else {
                setErrors({ general: response.message || 'Failed to resend code' });
            }
        } catch (error: any) {
            console.error('Resend code error:', error);
            setErrors({
                general: error?.response?.data?.message || 'An error occurred. Please try again.'
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
                        Verify Your Email
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        We've sent a 6-digit code to <br />
                        <span className="font-medium">{email}</span>
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border dark:border-none" style={{ borderColor: 'var(--border)' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <CodeInput
                            code={verificationCode}
                            onChange={handleVerificationCodeChange}
                            onSetFullCode={handleSetFullCode}
                            onKeyDown={handleVerificationKeyDown}
                            error={errors.verification}
                            disabled={isLoading}
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
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <button
                            onClick={handleResendCode}
                            className="text-sm hover:underline"
                            style={{ color: 'var(--primary)' }}
                            disabled={isLoading}
                        >
                            Didn't receive the code? Resend
                        </button>
                        <div>
                            <button
                                onClick={onBack}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:underline inline-flex items-center gap-1"
                                disabled={isLoading}
                            >
                                <ArrowLeft size={16} />
                                Back to registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
