import {  toast } from 'react-toastify';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [isUsernameTaken, setIsUsernameTaken] = useState(false); // Track if username is taken

  const validateForm = () => {
    let formIsValid = true;
    const newErrors = { username: '', password: '' };

    
    if (!username.trim()) {
      formIsValid = false;
      newErrors.username = 'Username is required';
    }

    if (!password.trim()) {
      formIsValid = false;
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return formIsValid;
  };
   
  const checkUsernameAvailability = async (username) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASEURL}/check-username`, {
        method: 'POST', // Using POST method to send username in the body
        body: JSON.stringify({ username }), // Sending the username in the body
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.status === 200 && data.isTaken) {
        setIsUsernameTaken(true);
        toast.error("Username is already taken!");
        return false;
      } else {
        setIsUsernameTaken(false);
        return true;
      }
    } catch (error) {
      console.error("Error checking username availability", error);
      toast.error("Error checking username availability. Please try again.");
      return false;
    }
  };
  

  const  handleRegister = async(e) => {
    e.preventDefault();

    const isUsernameAvailable = await checkUsernameAvailability(username);
      if (!isUsernameAvailable) return; // Stop form submission if username is taken

    if (validateForm()) {
   const response= await fetch(`${process.env.React_APP_BACKEND_BASEURL}/register`,{
      method:'POST',
      body: JSON.stringify({username,password}),
      headers:{'Content-Type':'application/json'},
     });
     if(response.status===200){
      toast.success("Registration Successful")
     }
     else{
      toast.error("Registration failed")
     }
      
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800">
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Register</h2>
      </div>

      <form onSubmit={handleRegister}>
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
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
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
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Register
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
            hiiiiiiiiiii
  </div>
);
};

export default Register;

