import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const { updatePassword, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid session (came from password reset email)
    const checkSession = async () => {
      try {
        // The user should be automatically logged in after clicking the reset link
        if (user) {
          setIsValidSession(true);
        } else {
          // If no user session, redirect to login
          toast.error('Invalid or expired password reset link');
          router.push('/login');
        }
      } catch (err) {
        toast.error('Invalid or expired password reset link');
        router.push('/login');
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [user, router]);

  const validatePasswords = () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setSuccess(true);
        toast.success('Password updated successfully!');
        
        // Redirect to dashboard/main app after 3 seconds
        setTimeout(() => {
          router.push('/dashboard'); // Adjust this route as needed
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-navy-700">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return null; // Will redirect to login
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-navy-700">
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Password Updated!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your password has been successfully updated. You will be redirected to your dashboard shortly.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-700 dark:text-green-400 text-sm">
                Redirecting to dashboard in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200 dark:border-navy-700">
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-navy-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              Password must be at least 6 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}