import React, { useState } from "react";
import swal from 'sweetalert';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios.js";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const { setCurrentUser, setUserToken } = useStateContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ __html: "" });
  const navigate = useNavigate();
  
  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({ __html: "" });

    axiosClient
      .post("/login", {
        email: email,
        password: password,
      })
      .then(({ data }) => {
        setCurrentUser(data.user);
        setUserToken(data.token);
        localStorage.setItem('auth_userId', data.user.id);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_name', data.user.firstname);
        localStorage.setItem('auth_role', data.role);
        localStorage.setItem('TOKEN', data.token);
        localStorage.setItem('TOKEN_EXPIRATION', data.expiration);
        swal("Success", "Logged in successfully!", "success"); // Update this line

        const role = data.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "user") {
          navigate("/user/dashboard");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          setError({ __html: error.response.data.error });
        } else if (error.response && error.response.data && error.response.data.errors) {
          const finalErrors = Object.values(error.response.data.errors).reduce(
            (accum, next) => [...accum, ...next],
            []
          );
          setError({ __html: finalErrors.join('<br>') });
        } else {
          console.error(error);
        }
      });
  };

    return (
      <div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Log in to your account
            </h2>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            
          {error.__html && (
            <div className="flex items-center text-sm mt-2 bg-red-500 py-2 px-4 rounded text-white">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <div
                className="bg-red-500 py-2 px-4 rounded text-white"
                dangerouslySetInnerHTML={error}
              ></div>
            </div>
          )}
            
            <form onSubmit={onSubmit} className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@example.com"
                    required
                    value={email}
                    onChange={ev => setEmail(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
        </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Log in
                </button>
              </div>
            </form>
  
            {/* <p className="mt-10 text-center text-sm text-gray-500">
              Not Registered Yet?{' '}
              <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Create an Account
              </Link>
            </p> */}

            <p className="mt-10 text-center text-sm text-gray-500">
              Forgot Password?{' '}
              <Link to="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Click here
              </Link>
            </p>

            <div className="absolute top-0 right-0 mt-4 mr-4">
              <Link
                to="/download-forms"
                className="text-indigo-600 font-semibold hover:text-indigo-500"
              >
                Download files here
              </Link>
            </div>
          </div>
        </div>
        </div>
        </div>
    )
  }
  