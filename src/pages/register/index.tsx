import { useState } from 'react';
import { RegisterForm } from './components/RegisterForm';
import { VerificationForm } from './components/VerificationForm';

export default function RegisterPage() {
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [email, setEmail] = useState('');

    const handleRegisterSuccess = (registeredEmail: string) => {
        setEmail(registeredEmail);
        setStep('verify');
    };

    const handleBackToRegister = () => {
        setStep('register');
    };

    if (step === 'verify') {
        return <VerificationForm email={email} onBack={handleBackToRegister} />;
    }

    return <RegisterForm onSuccess={handleRegisterSuccess} />;
}
