import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { login, requestPasswordReset, getRedirectPathByRole } from "../../services/authService";
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { FaCheckSquare, FaRegSquare, FaSpinner } from "react-icons/fa";
import { MdHeadsetMic } from "react-icons/md";

function Login() {
  const navigate = useNavigate();
  const { login: authLogin, getUserRole } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("rememberedCredentials");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUsername(parsed.username || "");
        setPassword(parsed.password || "");
        setRememberMe(true);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      // Lưu thông tin đăng nhập nếu remember me được chọn
      if (rememberMe) {
        localStorage.setItem("rememberedCredentials", JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem("rememberedCredentials");
      }

      // Gọi API đăng nhập
      const loginResponse = await login({ username, password });
      
      // Sử dụng AuthContext để lưu thông tin đăng nhập
      authLogin(loginResponse);
      
      // Lấy role và redirect
      const userRole = getUserRole();
      const redirectPath = getRedirectPathByRole(userRole);
      
      // Redirect ngay lập tức sau khi đăng nhập thành công
      navigate(redirectPath);
      
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");
    if (!username) {
      setError("Please enter username to reset password.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(username);
      setInfo("If the account exists, password reset instructions have been sent.");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Unable to process password reset request.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="mx-auto w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5e83ae] to-[#4a6b8a] rounded-xl shadow-lg">
              <MdHeadsetMic className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">TicketHub</h1>
          <p className="text-gray-600">Internal Support System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sign In</h2>
            <p className="text-gray-600 mt-1 text-sm">Welcome back! Please sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 text-sm">
              <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3 text-green-700 text-sm">
              <FiCheckCircle className="h-4 w-4 flex-shrink-0" />
              <span>{info}</span>
            </div>
          )}

          {loading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3 text-blue-700 text-sm">
              <FaSpinner className="h-4 w-4 flex-shrink-0 animate-spin" />
              <span>Đang xác thực thông tin đăng nhập...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] transition-colors placeholder-gray-400 text-sm"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] transition-colors placeholder-gray-400 text-sm"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {passwordVisible ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  {rememberMe ? (
                    <FaCheckSquare className="h-4 w-4 text-[#5e83ae]" />
                  ) : (
                    <FaRegSquare className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-[#4a6b8a] hover:font-medium transition-colors">Remember me</span>
                </div>
              </label>
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-[#4a6b8a] hover:font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r from-[#5e83ae] to-[#4a6b8a] text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <FaSpinner className="h-4 w-4 animate-spin" />}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>      
    </div>
  );
}

export default Login;