import React, { useEffect, useState } from "react";
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, PhotoIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios";
import swal from 'sweetalert';
import TButton from "../components/core/TButton";

export default function UserUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState({
        role: '',
        firstname: '',
        lastname: '',
        middlename: '',
        suffix: '',
        email: '',
        age: '',
        gender: '',
        status: '',
        contactnumber: '',
        address: '',
        image: '',
        password: '',
        passwordConfirmation: '',
    });
    const [roles, setRoles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [picture, setPicture] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New loading state

    useEffect(() => {
        axiosClient.get(`/admin/roles`).then(res => {
            if(res.data.status === 200)
            {
                setRoles(res.data.role);
            }
        });

        axiosClient.get(`/admin/category`).then(res => {
            if(res.data.status === 200)
            {
                setCategories(res.data.categories);
            }
        });

        axiosClient.get(`/admin/users/view/${id}`).then(res => {
            if(res.data.status === 200)
            {
                // console.log(res.data.user);
                setUserInput(res.data.user);
                setImageUrl(res.data.user.image); // Set the image URL
                setIsLoading(false); // Set loading to false when data is fetched
            }
            else if (res.data.status === 404)
            {
                swal("Error", res.data.message, "error")
                navigate("/admin/users");
            }
        }).catch(error => {
            swal("Error", "An error occurred while retrieving user data.", "error").then(() => {
                navigate("/admin/users");
            });
        });
    }, [id, navigate]);

    useEffect(() => {
        if (showAlert) {
        const timer = setTimeout(() => {
            setShowAlert(false);
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
        }
    }, [showAlert]);
    
    useEffect(() => {
        // Hide the success message after 3 seconds
        if (success) {
        const timer = setTimeout(() => {
            setSuccess("");
        }, 3000);
        return () => {
            clearTimeout(timer);
        };
        }
    }, [success]);
     

    const handleInput = (ev) => {
        ev.persist();
        setUserInput((prevUserInput) => ({
            ...prevUserInput,
            [ev.target.name]: ev.target.value,
        }));
    }

    // const handleImage = (ev) => {
    //     setPicture({ image:ev.target.files[0] });
    //     // setPicture(ev.target.files[0]);
    // }

    const handleRadioClick = () => {
        if (userInput.gender) {
          setUserInput((prevUserInput) => ({
            ...prevUserInput,
            gender: "",
          }));
        }
      };

    const handleStatusClick = (value) => {
        setUserInput((prevUserInput) => ({
            ...prevUserInput,
        status: value,
        }));
    };

    const handleImage = (ev) => {
        const selectedFile = ev.target.files[0];
        setPicture(selectedFile);
    };             

    const onSubmit = (ev) => {
        ev.preventDefault();

        const updatedUser = { ...userInput };
        const formData = new FormData();
        if (picture) {
            formData.append('image', picture);
        }

        console.log("Updated User:", updatedUser); // Add this console.log statement
        axiosClient
        .post(`/admin/users/update/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            params: updatedUser,
        })
        .then((res) => {
        if (res.data.status === 200) {
            setErrors({});
            setShowAlert(true); // Show the success alert

            // Refetch the updated list of users and update the state
            axiosClient
            .get(`/admin/users/view/${id}`)
            .then((res) => {
                if (res.data.status === 200) {
                setUserInput(res.data.user);
                setImageUrl(res.data.user.image);
                } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate("/admin/users");
                }
            })
            .catch((error) => {
                swal(
                "Error",
                "An error occurred while retrieving user data.",
                "error"
                ).then(() => {
                navigate("/admin/users");
                });
            });
        } else if (res.data.status === 422) {
            setErrors(res.data.message); // Set the error message
            console.log("Error", res.data.error.message);
        } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
            navigate("/admin/users");
        }
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with an error status code
                setErrors(error.response.data.message); // Set the error messages
                console.log(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
    };     

    if (isLoading) {
        return (
            <PageComponent title="User Update">
                <p>Please wait...</p>
            </PageComponent>
        );
    }

    return (
        <PageComponent title={"User Update"}>
            <p className="text-sm font-medium text-gray-500 pb-4">
                <span className="inline-flex items-center">
                    <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
                    You can view and update profile here
                </span>
            </p>
            <form action="#" method="POST" onSubmit={onSubmit} encType="multipart/form-data" className="grid grid-cols-2 gap-4">
                <div>
                <div className="shadow sm-overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        {/* Display error message */}
                        {Object.keys(errors).length > 0 && (
                            <div className="flex items-center text-sm mt-2 bg-red-500 py-2 px-4 rounded text-white">
                                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                                <div className="bg-red-500 py-2 px-4 rounded text-white">
                                    {Object.values(errors).map((errorMessage, index) => (
                                        <div key={index}>{errorMessage}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="px-4">
                            {showAlert && (
                                <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                                    <div>
                                        User Updated successfully
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Image */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                                Photo
                            </label>
                            <div className="flex flex-col items-center">
                                {!imageUrl && (
                                    <span className="flex justify-center items-center text-gray-400 h-24 w-24 mb-2 overflow-hidden rounded-full bg-gray-100">
                                        <PhotoIcon className="w-8 h-8" /> 
                                    </span>
                                )}
                                {imageUrl && (
                                    <div>
                                        <img
                                            src={`http://localhost:8000/${imageUrl}`}
                                            alt="Photo"
                                            className="w-24 h-24 object-cover mb-2"
                                        />
                                    </div>
                                )}
                                <input
                                    id="image"
                                    type="file"
                                    onChange={handleImage}
                                    name="image"
                                    className="hidden"
                                    multiple
                                />
                                <label
                                    htmlFor="image"
                                    className="relative px-4 py-2 mt-1 text-sm bg-white border border-indigo-500 text-indigo-500 rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white flex items-center"
                                >
                                    Choose Photo
                                </label>
                            </div>
                        </div>

                        {/* First Name */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="firstname"
                                className="block text-sm font-medium text-gray-700"
                            >
                                First Name
                            </label>
                            <input 
                                type="text"
                                name="firstname"
                                id="firstname"
                                onChange={handleInput} value={userInput.firstname}
                                placeholder="First Name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* First Name */}

                        {/* Last Name */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="lastname"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Last Name
                            </label>
                            <input 
                                type="text"
                                name="lastname"
                                id="lastname"
                                onChange={handleInput} value={userInput.lastname}
                                placeholder="Last Name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Last Name */}

                        {/* Middle Name */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="middlename"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Middle Name
                            </label>
                            <input 
                                type="text"
                                name="middlename"
                                id="middlename"
                                onChange={handleInput} value={userInput.middlename}
                                placeholder="Middle Name"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Middle Name */}

                        {/* Suffix */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="suffix"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Suffix
                            </label>
                            <input 
                                type="text"
                                name="suffix"
                                id="suffix"
                                onChange={handleInput} value={userInput.suffix}
                                placeholder="Suffix"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Suffix */}

                        {/* Contact Number */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="contactnumber"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Contact Number
                            </label>
                            <input 
                                type="text"
                                name="contactnumber"
                                id="contactnumber"
                                onChange={handleInput} value={userInput.contactnumber}
                                placeholder="(+63)"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Contact Number */}

                        {/* Address */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <input 
                                type="text"
                                name="address"
                                id="address"
                                onChange={handleInput} value={userInput.address}
                                placeholder="Address"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Address */}
                        </div>
                    </div>
                </div>
                
                        <div>
                            <div className="shadow sm-overflow-hidden sm:rounded-md">
                                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">

                        {/* Age */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="age"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Age
                            </label>
                            <input 
                                type="text"
                                name="age"
                                id="age"
                                onChange={handleInput} value={userInput.age}
                                placeholder="Age"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Age */}

                        {/* Gender */}
                            <div className="flex items-start">
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Gender
                                </label>
                                <div className="flex h-5 items-center ml-4">
                                    <input 
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        value="Male"
                                        checked={userInput.gender === 'Male'}
                                        onChange={handleInput}
                                        onClick={handleRadioClick}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="ml=3 text-sm">
                                    <label htmlFor="male" className="ml-2 font-medium text-gray-700">
                                        Male
                                    </label>
                                </div>

                                <div className="flex h-5 items-center ml-4">
                                    <input 
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        value="Female"
                                        checked={userInput.gender === 'Female'}
                                        onChange={handleInput}
                                        onClick={handleRadioClick}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="ml=3 text-sm">
                                    <label htmlFor="female" className="ml-2 font-medium text-gray-700">
                                        Female
                                    </label>
                                </div>
                            </div>
                        {/* Gender */}

                        {/* Email Address */}
                        <div className="col-span-6 sm:col-span-3">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input 
                                type="text"
                                name="email"
                                id="email"
                                autoComplete="firstname"
                                onChange={handleInput} value={userInput.email}
                                placeholder="Email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Email Address */}

                        {/* Password */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="new-password"
                                value={userInput.password}
                                onChange={handleInput}
                                placeholder="Password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Password */}

                        {/* Confirm Password */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="password-confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="password-confirmation"
                                name="password_confirmation"
                                value={userInput.passwordConfirmation}
                                onChange={handleInput}
                                placeholder="Confirm Password"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        {/* Confirm Password */}

                        {/* Status */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                        <div className="flex items-start">
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                            </label>
                            <div className="flex h-5 items-center ml-4">
                            <input
                                type="radio"
                                name="status"
                                id="active"
                                value="Active"
                                checked={userInput.status === 'Active'}
                                onChange={() => handleStatusClick('Active')}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            </div>
                            <div className="ml=3 text-sm">
                            <label htmlFor="Active" className="ml-2 font-medium text-gray-700">
                                Active
                            </label>
                            </div>

                            <div className="flex h-5 items-center ml-4">
                            <input
                                type="radio"
                                name="status"
                                id="disabled"
                                value="Disabled"
                                checked={userInput.status === 'Disabled'}
                                onChange={() => handleStatusClick('Disabled')}
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            </div>
                            <div className="ml=3 text-sm">
                            <label htmlFor="Disabled" className="ml-2 font-medium text-gray-700">
                                Disabled
                            </label>
                            </div>
                        </div>
                        </div>
                        {/* Status */}

                        {/* Role */}
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                            </label>

                            <select
                                id="role"
                                name="role"
                                value={userInput.role} // Set the initial value of the dropdown
                                onChange={handleInput}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                {/* Render the roles as dropdown options */}
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Role */}

                        {/* Update Button */}
                        <div className=" px-4 py-3 text-right sm:px-6">
                            <TButton>
                                Update
                            </TButton>
                        </div>
                        {/* Update Button */}
                    </div>
                </div>
                </div>    
            </form>
        </PageComponent>
    )
}