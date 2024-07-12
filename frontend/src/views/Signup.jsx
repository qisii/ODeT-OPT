import React, { useState } from "react";
import swal from 'sweetalert';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios.js";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const { setCurrentUser, setUserToken } = useStateContext();

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [contactnumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState({ __html: "" });
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();
    setError({ __html: "" });

    // Check if the email has the required domain
    if (!email.endsWith("@opt.com")) {
      setError({ __html: "Email must have the @opt.com domain" });
      return;
    }

    axiosClient
      .post("/signup", {
        firstname: firstname,
        lastname: lastname,
        contactnumber: contactnumber,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      })
      .then(({ data }) => {
        setCurrentUser(data.user);
        setUserToken(data.token);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_name', data.user.firstname);
        localStorage.setItem('auth_role', data.role);
        swal("Success", "Signup successful!", "success"); // Display SweetAlert message
        navigate("/guest/dashboard");
      })
      .catch((error) => {
        if (error.response) {
          const finalErrors = Object.values(error.response.data.errors).reduce(
            (accum, next) => [...accum, ...next],
            []
          );
          console.log(finalErrors);
          setError({ __html: finalErrors.join("<br>") });
        }
        console.error(error);
      });
  };

  const handleNameChange = (ev) => {
    const { name, value } = ev.target;

    // Capitalize the first letter of the value
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);

    // Update the corresponding state based on the input field name
    if (name === "firstname") {
      setFirstName(capitalizedValue);
    } else if (name === "lastname") {
      setLastName(capitalizedValue);
    }
  };

    return (
        <div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign up for free
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
                <label htmlFor="firstname" className="block text-sm font-medium leading-6 text-gray-900">
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    required
                    value={firstname}
                    onChange={handleNameChange}
                    placeholder="First Name"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastname" className="block text-sm font-medium leading-6 text-gray-900">
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    placeholder="Last Name"
                    required
                    value={lastname}
                    onChange={handleNameChange}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactnumber" className="block text-sm font-medium leading-6 text-gray-900">
                  Contact Number
                </label>
                <div className="mt-2">
                  <input
                    id="contactnumber"
                    name="contactnumber"
                    type="text"
                    placeholder="(+63)"
                    required
                    value={contactnumber}
                    onChange={ev => setContactNumber(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@opt.com"
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
                    placeholder="Password"
                    required
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password-confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password-confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={passwordConfirmation}
                    onChange={ev => setPasswordConfirmation(ev.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm text-gray-500">
              Already Registered?{" "}
              <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Login in to your account
              </Link>
            </p>
          </div>
        </div>
    )
  }
  