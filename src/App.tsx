import { useState, useRef, useEffect } from 'react';

type AuthStep = 'initial' | 'phone' | 'otp';

function App() {
  const [step, setStep] = useState<AuthStep>('initial');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setStep('otp');
      setTimer(30);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Verifying OTP:', otp.join(''));
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    otpInputs.current[0]?.focus();
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-8 py-6">
        <h1 className="text-3xl font-serif text-gray-800">Feastify</h1>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {step === 'initial' && (
            <div className="text-center space-y-8">
              <div className="space-y-3">
                <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                  Get your food in a flash
                </h2>
                <p className="text-lg text-gray-600">Sign In To Get Started</p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center gap-3 text-lg">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">or</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <button
                  onClick={() => setStep('phone')}
                  className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-4 rounded-full border border-gray-300 transition-colors text-lg"
                >
                  Continue with Phone Number
                </button>
              </div>

              <p className="text-sm text-gray-500 pt-4">
                By continuing, you agree to your Terms of Service and Privacy Policy
              </p>
            </div>
          )}

          {step === 'phone' && (
            <div className="text-center space-y-8">
              <div className="space-y-3">
                <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                  Login or sign up
                </h2>
                <p className="text-lg text-gray-600">
                  We'll send you one time password to your phone number
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-left text-gray-700 font-medium text-lg">
                    Mobile Number
                  </label>
                  <div className="flex items-center bg-white border border-gray-300 rounded-full overflow-hidden">
                    <div className="px-6 py-4 border-r border-gray-300 text-gray-700 font-medium">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9897865467"
                      className="flex-1 px-6 py-4 text-lg outline-none"
                      maxLength={10}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-full transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={phoneNumber.length !== 10}
                >
                  Send OTP
                </button>
              </form>

              <p className="text-sm text-gray-500">
                This helps us keep your account secure
              </p>
            </div>
          )}

          {step === 'otp' && (
            <div className="text-center space-y-8">
              <div className="space-y-3">
                <h2 className="text-5xl font-bold text-gray-800 leading-tight">
                  Verify Your Mobile Number
                </h2>
                <p className="text-lg text-gray-600">
                  Enter the 6 digit code sent to +91 {phoneNumber}
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <div className="text-gray-600">
                  {timer > 0 ? (
                    <p>Resend OTP in {formatTimer()}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 rounded-full transition-colors text-lg"
                >
                  Verify & Login
                </button>
              </form>

              <button
                onClick={() => setStep('phone')}
                className="text-gray-700"
              >
                Entered the wrong number?{' '}
                <span className="font-semibold text-gray-800">Change it</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
