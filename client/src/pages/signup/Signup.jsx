import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from "./../../apiCalls/auth";
import { toast } from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

const Signup = () => {

  const [firstname , setFirstName] = useState()
  const [lastname , setLastName] = useState()
  const [email , setEmail] = useState()
  const [password , setPassword] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  
  const handleSubmit = async (e) => {
  e.preventDefault() // it will not reload the page when the form is submit
      
    let response = null;
    try {
      dispatch(showLoader());
     response =  await signupUser({firstname , lastname , email , password})
      dispatch(hideLoader());

     if(response.success){
      toast.success(response.message)
     // window.location.href = "/login"
     navigate('/login')
    }
    else{
      toast.error(response.message)
    }
    } 
    catch (error) {
      dispatch(hideLoader());
      toast.error(response.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-100">
      <div className="bg-white p-8 rounded-md shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              autoComplete="off"
              placeholder="Enter First Name"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              autoComplete="off"
              placeholder="Enter Last Name"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?
        </p>

        <Link
          to="/login"
          className="mt-2 block text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded transition"
        >
          Login
        </Link>
      </div>
    </div>
  )
}

export default Signup