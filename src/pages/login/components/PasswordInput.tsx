import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
    label?: string;
    placeholder?: string;
    autocompleteType?: 'current-password' | 'new-password';
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
    value,
    onChange,
    error,
    disabled,
    label = 'Password',
    placeholder = 'Enter your password',
    autocompleteType = 'current-password',
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                {label}
            </label>
            <div className="relative">
                <input
                    id={autocompleteType == "current-password" ? "current-password" : "new-password"}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 pr-12 rounded-lg border focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    style={{
                        borderColor: error ? '#ef4444' : 'var(--border)',
                        backgroundColor: 'var(--input)'
                    }}
                    disabled={disabled}
                    autoComplete={autocompleteType}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
