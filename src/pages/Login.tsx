import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Spinner from '@/components/Spinner';
import { useNavigate, useLocation } from 'react-router-dom';
import { validateLogin } from '@/utils/validate';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateLogin(email, password);
    if (v) {
      setError(v);
      return;
    }
    setError('');
    try {
      setLoading(true);
      const result = await auth.login(email, password);
      if (result.ok) {
        toast.success('Đăng nhập thành công!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
        });
        
        const from = (location.state as any)?.from?.pathname || '/admin';
        // Delay navigation slightly to show the toast
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
        return;
      }
      setError(result.error || 'Đăng nhập thất bại');
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-senior-pale via-senior-light to-senior-sky/10 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-senior-sky/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-senior-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-senior-blue to-senior-accent rounded-full mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold font-mulish text-senior-navy mb-2">
            MedBuddy Admin
          </h1>
          <p className="text-senior-steel text-sm">
            Hệ thống quản trị y tế thông minh
          </p>
        </div>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-fade-in-up">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold font-mulish text-senior-navy mb-2">
              Đăng nhập quản trị
            </CardTitle>
            <p className="text-senior-steel text-sm">
              Vui lòng nhập thông tin để tiếp tục
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-senior-navy">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-senior-steel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-senior-soft rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-senior-accent focus:border-transparent transition-all duration-200 placeholder-senior-steel/60"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@medbuddy.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-senior-navy">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-senior-steel" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-10 py-3 border border-senior-soft rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-senior-accent focus:border-transparent transition-all duration-200 placeholder-senior-steel/60"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    aria-describedby="toggle-password"
                  />
                  <button
                    type="button"
                    id="toggle-password"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-senior-steel"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-3.5-10-8 1-4.5 5-8 10-8 1 0 1.95.2 2.85.56M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center animate-gentle-bounce">
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || auth.loading}
                className="w-full bg-gradient-to-r from-senior-blue to-senior-accent hover:from-senior-accent hover:to-senior-blue text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-senior-accent focus:ring-offset-2"
              >
                <span className="flex items-center justify-center">
                  {loading || auth.loading ? <Spinner size={20} /> : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  )}
                  {loading || auth.loading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
                </span>
              </Button>

              {/* Additional Links */}
              <div className="text-center pt-4">
                <a href="#" className="text-sm text-senior-accent hover:text-senior-blue transition-colors duration-200">
                  Quên mật khẩu?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Login;
