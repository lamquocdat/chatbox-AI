import React from 'react';

interface CodeInputProps {
    code: string[];
    onChange: (index: number, value: string) => void;
    onSetFullCode: (fullCode: string[]) => void;
    onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: string;
    disabled?: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ code, onChange, onSetFullCode, onKeyDown, error, disabled }) => {
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // Chỉ lấy số, bỏ qua ký tự khác
        const numbers = pastedData.replace(/\D/g, '');

        // Chỉ lấy tối đa 6 số
        const digits = numbers.slice(0, 6).split('');

        // Tạo mảng 6 phần tử, điền số vào, phần còn lại để rỗng
        const newCode = Array(6).fill('');
        digits.forEach((digit, index) => {
            newCode[index] = digit;
        });

        // Set toàn bộ code cùng lúc
        onSetFullCode(newCode);

        // Focus vào ô cuối cùng đã điền hoặc ô cuối
        setTimeout(() => {
            const lastIndex = Math.min(digits.length, 5);
            const lastInput = document.getElementById(`code-${lastIndex}`);
            lastInput?.focus();
        }, 0);
    };

    const handleInput = (index: number, value: string) => {
        // Chỉ cho phép số
        const numericValue = value.replace(/\D/g, '');
        onChange(index, numericValue);
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-3 text-center" style={{ color: 'var(--foreground)' }}>
                Enter Verification Code
            </label>
            <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                    <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInput(index, e.target.value)}
                        onKeyDown={(e) => onKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-xl font-bold rounded-lg border focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        style={{
                            borderColor: error ? '#ef4444' : 'var(--border)',
                            backgroundColor: 'var(--input)'
                        }}
                        disabled={disabled}
                    />
                ))}
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
            )}
        </div>
    );
};
