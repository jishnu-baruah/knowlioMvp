// components/auth/LoginForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockLogin } from '../../lib/mockAuth';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mockLogin(email, password)) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3f51b5] to-[#7986cb] text-transparent bg-clip-text">
              KNOWlio
            </h1>
          </Link>
          <p className="text-[#3f51b5]/70 mt-2">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#3f51b5] mb-2">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#c5cae9] rounded-xl focus:ring-2 
                       focus:ring-[#3f51b5] focus:border-transparent outline-none
                       transition-all bg-white/50 backdrop-blur-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3f51b5] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#c5cae9] rounded-xl focus:ring-2 
                       focus:ring-[#3f51b5] focus:border-transparent outline-none
                       transition-all bg-white/50 backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-[#c5cae9] text-[#3f51b5] 
                         focus:ring-[#3f51b5]"
              />
              <label htmlFor="remember" className="ml-2 text-[#3f51b5]/70">
                Remember me
              </label>
            </div>
            <a href="#" className="text-[#3f51b5] hover:text-[#7986cb] transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#3f51b5] to-[#7986cb] text-white 
                     py-3 px-4 rounded-xl font-medium hover:opacity-90 transform 
                     transition-all focus:outline-none focus:ring-2 
                     focus:ring-[#3f51b5] focus:ring-offset-2 shadow-lg"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#3f51b5]/70">
          Don't have an account?{' '}
          <a href="#" className="text-[#3f51b5] hover:text-[#7986cb] font-medium transition-colors">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}