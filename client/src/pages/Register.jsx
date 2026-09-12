import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SquareTerminal, User, Mail, Lock, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 text-white shadow-md mb-2">
            <SquareTerminal className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Create TaskFlow Account</h2>
          <p className="text-xs text-zinc-600 font-medium">Join your team's DevOps & Task Management Platform</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-800">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-800">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dev@taskflow.dev"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-800">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-800">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl pl-10 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-zinc-600 border-t border-zinc-100">
            Already have an account?{' '}
            <Link to="/login" className="text-zinc-900 hover:underline font-bold transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
