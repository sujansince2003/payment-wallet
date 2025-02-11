import { useState } from "react";
import API from "../axiosInstance";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleInputChange(e) {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/user/signup", formData);
      if (res.status === 200) {
        alert("account created successfully");
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert("error while creating account");
    }
  }
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="your@email.com"
                name="email"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="username"
                name="username"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
                name="password"
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?
            <a
              href="#"
              className="text-indigo-600 pl-2 hover:text-indigo-500 font-medium"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
