import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  IS_LOGGED_IN: 'isLoggedIn',
  REMEMBER_ME: 'rememberMe',
  SAVED_EMAIL: 'savedEmail',
};

const Auth = () => {
  const navigate = useNavigate();

  const [currentState, setCurrentState] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [otpEmail, setOtpEmail] = useState('');

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Load Lottie Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    script.type = 'module';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });

    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      navigate('/dashboard');
    }

    const savedRememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
    if (savedRememberMe) {
      const savedEmail = localStorage.getItem(STORAGE_KEYS.SAVED_EMAIL);
      if (savedEmail) {
        setLoginEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, [navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const transitionToState = (newState) => {
    setCurrentState(newState);
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    if (!loginPassword) {
      showToast('Please enter your password', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (loginEmail === 'admin@gmail.com' && loginPassword === 'Admin@123') {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'demo_access_token');
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'demo_refresh_token');
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        localStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify({ email: loginEmail, name: 'Admin' })
        );

        if (rememberMe) {
          localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
          localStorage.setItem(STORAGE_KEYS.SAVED_EMAIL, loginEmail);
        } else {
          localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
          localStorage.removeItem(STORAGE_KEYS.SAVED_EMAIL);
        }

        showToast('Login successful!', 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Handle Login with OTP - Send OTP
  const handleLoginWithOtp = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(otpEmail)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setUserEmail(otpEmail);
      transitionToState('otpLogin');
      showToast('OTP sent to your email!', 'success');
    } catch (error) {
      showToast('Failed to send OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // NEW: Handle OTP Login - Verify OTP and Login
  const handleVerifyOtpLogin = async (e) => {
    e.preventDefault();

    const otp = otpValues.join('');
    if (otp.length !== 6) {
      showToast('Please enter complete OTP', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate OTP verification and login
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'demo_access_token');
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, 'demo_refresh_token');
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify({ email: userEmail, name: 'User' })
      );

      showToast('Login successful!', 'success');
      setOtpValues(['', '', '', '', '', '']);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      showToast('Invalid OTP. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('OTP resent successfully!', 'success');
      setOtpValues(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      showToast('Failed to resend OTP', 'error');
    }
  };

  const handleBackToLogin = () => {
    setOtpEmail('');
    setOtpValues(['', '', '', '', '', '']);
    transitionToState('login');
  };

  const renderFormHeader = () => {
    const headers = {
      login: { title: 'Welcome Back', subtitle: 'Sign in to your admin account' },
      loginWithOtp: { title: 'Login with OTP', subtitle: 'Enter your email to receive OTP' },
      otpLogin: { title: 'Verify OTP', subtitle: 'Enter the code sent to your email' },
    };

    const header = headers[currentState];
    if (!header.title) return null;

    return (
      <div className="auth-form-header" data-aos="fade-down" data-aos-duration="800" data-aos-delay="500">
        <h1 className="auth-form-title">{header.title}</h1>
        <p className="auth-form-subtitle">{header.subtitle}</p>
      </div>
    );
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background Animation */}
      <div className="auth-bg-animation">
        <div className="auth-floating-shape"></div>
        <div className="auth-floating-shape"></div>
        <div className="auth-floating-shape"></div>
        <div className="auth-floating-shape"></div>
      </div>

      {/* Login Container */}
      <div className="auth-login-container auth-page-transition" data-aos="fade-up" data-aos-duration="800">
        {/* Left Side - Image Section */}
        <div className="auth-image-section" data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
          <div className="auth-image-placeholder" data-aos="zoom-in" data-aos-duration="1200" data-aos-delay="400">
            <dotlottie-wc
              className="auth-lottie-animation"
              src="https://lottie.host/a4c6719e-61fe-4018-acd4-06accf89e2c3/OmQZVdzdej.lottie"
              speed="1"
              autoplay
              loop
            ></dotlottie-wc>
          </div>

          <div className="auth-brand-info" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
            <div className="auth-brand-logo">
              <i className="fas fa-boxes"></i>
              <div className="auth-brand-name">Inventory Management</div>
            </div>
            <div className="auth-brand-tagline">Advanced Inventory Management Software</div>
            <div className="auth-brand-description">
              Take full control of your stock, suppliers, and sales with our intelligent inventory
              management solution built for efficiency and accuracy.
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="auth-form-section" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="300">
          {renderFormHeader()}

          {/* LOGIN FORM */}
          {currentState === 'login' && (
            <form className="auth-login-form" onSubmit={handleLogin}>
              <div className="auth-form-group" data-aos="fade-up" data-aos-duration="600" data-aos-delay="700">
                <label htmlFor="email" className="auth-form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="auth-form-input"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <i className="fas fa-envelope auth-input-icon"></i>
              </div>

              <div className="auth-form-group" data-aos="fade-up" data-aos-duration="600" data-aos-delay="800">
                <label htmlFor="password" className="auth-form-label">Password</label>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  id="password"
                  className="auth-form-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <i className="fas fa-lock auth-input-icon"></i>
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  <i className={`fas ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>

              <div className="auth-form-options" data-aos="fade-up" data-aos-duration="600" data-aos-delay="900">
                <label className="auth-remember-me">
                  <div className="auth-remember-checkbox">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="auth-checkmark"></span>
                  </div>
                  <span className="auth-remember-label">Remember me</span>
                </label>
                <a 
                  href="#" 
                  className="auth-forgot-password" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    transitionToState('loginWithOtp'); 
                  }}
                >
                  Login with OTP
                </a>
              </div>

              <button
                type="submit"
                className={`auth-btn-primary ${isLoading ? 'auth-loading' : ''}`}
                disabled={isLoading}
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="1000"
              >
                <div className="auth-spinner"></div>
                <span className="auth-button-text">
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </span>
              </button>

              <div className="auth-demo-info" data-aos="fade-up" data-aos-duration="600" data-aos-delay="1100">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: <strong>admin@gmail.com</strong> | Password: <strong>Admin@123</strong></p>
              </div>
            </form>
          )}

          {/* LOGIN WITH OTP FORM - Enter Email */}
          {currentState === 'loginWithOtp' && (
            <form className="auth-forgot-password-form" onSubmit={handleLoginWithOtp}>
              <div className="auth-form-group">
                <label htmlFor="otpEmail" className="auth-form-label">Email Address</label>
                <input
                  type="email"
                  id="otpEmail"
                  className="auth-form-input"
                  placeholder="Enter your registered email"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  required
                />
                <i className="fas fa-envelope auth-input-icon"></i>
              </div>

              <button type="submit" className={`auth-btn-primary ${isLoading ? 'auth-loading' : ''}`} disabled={isLoading}>
                <div className="auth-spinner"></div>
                <span className="auth-button-text">
                  <i className="fas fa-paper-plane"></i>
                  Send OTP
                </span>
              </button>

              <button type="button" className="auth-btn-secondary" onClick={handleBackToLogin}>
                <i className="fas fa-arrow-left"></i>
                Back to Login
              </button>
            </form>
          )}

          {/* OTP LOGIN FORM - Verify OTP */}
          {currentState === 'otpLogin' && (
            <form className="auth-otp-verification-form" onSubmit={handleVerifyOtpLogin}>
              <div className="auth-otp-info-text">
                <p>We've sent a 6-digit verification code to</p>
                <p className="auth-otp-email"><strong>{userEmail}</strong></p>
              </div>

              <div className="auth-form-group">
                <label className="auth-form-label">Enter OTP</label>
                <div className="auth-otp-inputs">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      className="auth-otp-input"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </div>

              <div className="auth-resend-section">
                <p className="auth-resend-text">
                  Didn't receive code?{' '}
                  <button type="button" className="auth-resend-link" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                </p>
              </div>

              <button type="submit" className={`auth-btn-primary ${isLoading ? 'auth-loading' : ''}`} disabled={isLoading}>
                <div className="auth-spinner"></div>
                <span className="auth-button-text">
                  <i className="fas fa-sign-in-alt"></i>
                  Login with OTP
                </span>
              </button>

              <button type="button" className="auth-btn-secondary" onClick={handleBackToLogin}>
                <i className="fas fa-arrow-left"></i>
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`auth-toast ${toast.type} ${toast.show ? 'auth-show' : ''}`}>
        <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Auth;
