// app/login/page.tsx
'use client';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8eaf6] via-[#c5cae9] to-[#3f51b5] flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}