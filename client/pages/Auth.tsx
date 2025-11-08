import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth, type AuthUser } from "@/hooks/useLocalStorage";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    incomeType: "salaried",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [, { signup, login }] = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "login") {
        if (!formData.email || !formData.password) {
          setError("Please fill in all fields");
          setIsLoading(false);
          return;
        }
        if (!validateEmail(formData.email)) {
          setError("Please enter a valid email");
          setIsLoading(false);
          return;
        }

        const success = login(formData.email, formData.password);
        if (success) {
          // Wait a moment for auth state to update
          setTimeout(() => navigate("/dashboard"), 100);
        } else {
          setError("Invalid email or password");
        }
      } else {
        if (!formData.name || !formData.email || !formData.password || !formData.age) {
          setError("Please fill in all fields");
          setIsLoading(false);
          return;
        }
        if (!validateEmail(formData.email)) {
          setError("Please enter a valid email");
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const age = parseInt(formData.age);
        if (age < 18 || age > 100) {
          setError("Please enter a valid age (18-100)");
          setIsLoading(false);
          return;
        }

        // Check if email already exists
        const existingUser = localStorage.getItem(`finwise_user_${formData.email}`);
        if (existingUser) {
          setError("Email already registered. Please login instead.");
          setIsLoading(false);
          return;
        }

        const success = signup(
          formData.name,
          formData.email,
          formData.password,
          age,
          formData.incomeType
        );

        if (success) {
          // Wait a moment for auth state to update
          setTimeout(() => navigate("/onboarding"), 100);
        } else {
          setError("Failed to create account. Please try again.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-3xl">
              ₹
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            FinWise
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Master Money. Level Up Life.</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Mode Switcher Tabs */}
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-4 font-semibold transition-all border-b-2 ${
                mode === "login"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`flex-1 py-4 font-semibold transition-all border-b-2 ${
                mode === "signup"
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {mode === "signup" && (
              <>
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Age Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="18"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>

                {/* Income Type Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Income Type
                  </label>
                  <select
                    name="incomeType"
                    value={formData.incomeType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  >
                    <option value="salaried">Salaried Employee</option>
                    <option value="freelance">Freelancer/Gig Worker</option>
                    <option value="business">Business Owner</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              {mode === "signup" && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  At least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password Field (Signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Please wait..."
                : mode === "login"
                  ? "Login to FinWise"
                  : "Create Account"}
            </button>
          
            {/* Inline switch helper */}
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>

            {/* Demo Login CTA (moved below form) */}
            <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => {
                  const demoEmail = "demo@finwise.app";
                  const demoPassword = "demo123";
                  const demoAge = 25;
                  const demoIncome = "salaried";
                  const demoName = "Demo User";

                  const existingUser = localStorage.getItem(`finwise_user_${demoEmail}`);
                  if (existingUser) {
                    const success = login(demoEmail, demoPassword);
                    if (success) {
                      const user = JSON.parse(existingUser) as AuthUser;
                      if (user.onboardingComplete) {
                        setTimeout(() => navigate("/dashboard"), 100);
                      } else {
                        setTimeout(() => navigate("/onboarding"), 100);
                      }
                    }
                  } else {
                    signup(demoName, demoEmail, demoPassword, demoAge, demoIncome);
                    setTimeout(() => navigate("/onboarding"), 100);
                  }
                }}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-900 dark:text-white rounded-lg font-medium transition-colors text-sm"
              >
                Login as Demo User
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6">
          This is a demo app. Your data is saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
