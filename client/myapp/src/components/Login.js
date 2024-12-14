import React, { useState,useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [redirect, setRedirect] = useState(false);
 const {setUserinfo} = useContext(UserContext);

  const handleLogin = async(e) => {
    e.preventDefault();

try {
  const response=  await fetch(`${process.env.React_APP_BACKEND_BASEURL}/login`,{
    method:'POST',
    body:JSON.stringify({username,password}),
    headers:{'Content-Type':'application/json'},
    credentials:'include', 
    });
    if(response.ok){
      response.json().then(userinfo=>{
        setUserinfo(userinfo);
        toast.success("Login successful!");
        setRedirect(true);
      })
     
    }
    else{
     const errorData = await response.json();
     if (response.status === 404) {
       setErrors({ email: "Username not found", password: "" });
     } else if (response.status === 401) {
       setErrors({ email: "", password: "Incorrect password" });
     } else {
       toast.error(errorData.message || "An error occurred");
     }
    }
} catch (error) {
  toast.error("Network error. Please try again later.");
}
    
     
  };
if(redirect){
  return <Navigate to='/'/>
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Login
          </h2>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="mt-2 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
              placeholder="Enter Username"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
