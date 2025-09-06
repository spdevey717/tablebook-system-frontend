// Import Main Libraries
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Import Other Libraries
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

// Import Custom Libraries
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login, loginWithGoogle, isAuthenticated, isAdmin, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // If user is already authenticated and just arrived at login page, redirect them
      console.log("[DEBUG] User is already authenticated and just arrived at login page, redirecting them");
      if (!success) {
        const from = location.state?.from?.pathname || '/';
        console.log("[DEBUG] From:", from);
        
        // If user was trying to access admin panel and is admin, redirect there
        if (from.startsWith('/admin') && isAdmin) {
          console.log("[DEBUG] User was trying to access admin panel and is admin, redirecting them");
          navigate('/admin');
        } else if (from.startsWith('/admin') && !isAdmin) {
          // If user is not admin but was trying to access admin, redirect to home
          console.log("[DEBUG] User was trying to access admin panel and is not admin, redirecting them to home");
          navigate('/');
        } else {
          // Otherwise redirect to where they were trying to go
          console.log("[DEBUG] User was trying to access admin panel and is not admin, redirecting them to where they were trying to go");
          navigate(from);
        }
        return;
      }

      // If login was just successful, show success message then redirect
      const timer = setTimeout(() => {
        const from = location.state?.from?.pathname || '/';
        
        // If user was trying to access admin panel and is admin, redirect there
        if (from.startsWith('/admin') && isAdmin) {
          navigate('/admin');
        } else if (from.startsWith('/admin') && !isAdmin) {
          // If user is not admin but was trying to access admin, redirect to home
          navigate('/');
        } else {
          // Otherwise redirect to where they were trying to go
          navigate(from);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAdmin, navigate, location, isLoading, success]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) return; // Prevent submission if already authenticated
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      setSuccess(true);
      setError('');
    } catch (error) {
      console.error('[ERROR] Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (isAuthenticated) return; // Prevent submission if already authenticated
    
    setError('');
    console.log("[DEBUG] Credential Response:", credentialResponse);

    try {
      loginWithGoogle(credentialResponse);
      setSuccess(true);
      setError('');
    } catch (error) {
      console.error('[ERROR] Error logging in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">TableBook.Me</h1>
          <p className="text-gray-600">
            {isAuthenticated ? 'Authentication successful!' : 'Sign in to your account'}
          </p>
        </div>

        {/* Login Form */}
        <div className="card p-8">
          <form onSubmit={handleEmailLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={isLoading || isAuthenticated}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={isLoading || isAuthenticated}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading || isAuthenticated}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <p className="text-green-700 text-sm">Login successful! Redirecting...</p>
                </div>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || isAuthenticated}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google OAuth Button */}
          <GoogleLogin 
            onSuccess={ handleGoogleLogin } />

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot your password?
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
