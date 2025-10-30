import React from 'react';

interface EmailInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, error, disabled }) => {
    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Email Address
            </label>
            <input
                id="email"
                type="email"
                value={value}
                onChange={onChange}
                placeholder="your.name@hpt.vn"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white  transition-colors"
                style={{
                    borderColor: error ? '#ef4444' : 'var(--border)',
                    backgroundColor: 'var(--input)'
                }}
                disabled={disabled}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};
