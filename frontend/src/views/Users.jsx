import { useEffect, useState } from "react";
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, MagnifyingGlassCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios.js";
import TButton from "../components/core/TButton";
import UserListItem from "../components/UserListItem";
import swal from 'sweetalert';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [contactnumber, setContactNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [totalCount, setTotalCount] = useState(0); // State to hold the total count
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        userId: null,
        userEmail: '',
    });    
    const navigate = useNavigate();
    const [roleFilter, setRoleFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New loading state

    // Function to fetch offices
    const fetchUsers = (page, roleFilter, searchQuery, setUsers, setTotalPages) => {
        setIsLoading(true);
        let fetchPage = page;
        // Reset the page to 1 if filters or search query are applied
        if (roleFilter !== "" && searchQuery !== "") {
            setCurrentPage(page); // Reset current page to 1
        }else if (currentPage !== 1 && (roleFilter !== "" || searchQuery !== "")) {
            setCurrentPage(page); // Go back to page 1
        }

        axiosClient
        .get(`/admin/users?page=${fetchPage}&role=${roleFilter}&search=${searchQuery}`)
        .then(({ data }) => {
        setUsers(data.users.data);
        setTotalPages(data.users.last_page);
        setTotalCount(data.users.total);
        setIsLoading(false);
        })
        .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false);
        });
    };

    // Function to handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        
        // Fetch users for the selected page with the filter parameters
        fetchUsers(page, roleFilter, searchQuery, setUsers, setTotalPages);
    };
        
    useEffect(() => {
        fetchUsers(currentPage, roleFilter, searchQuery, setUsers, setTotalPages);
    }, [currentPage, roleFilter, searchQuery]);

    const onSubmit = (ev) => {
        ev.preventDefault();
        axiosClient
        .post("/admin/users/add-admin", {
            firstname: firstname,
            lastname: lastname,
            contactnumber: contactnumber,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
        })
        .then((response) => {
            setErrors({}); // Clear any previous error message
            setSuccess("User added successfully"); // Set the success message
            setTimeout(() => {
            handleModalClose();
            }, 2000); // Close the modal form after 2 seconds
    
            // Refetch the updated list of users and update the state
            axiosClient
            .get("/admin/users")
            .then(({ data }) => {
                setUsers(data.users.data);
                setTotalPages(data.users.last_page);
                setTotalCount(data.users.total); // Set the total count
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
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

    const capitalizeFirstLetter = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };
    
    const handleNameChange = (ev) => {
        const { name, value } = ev.target;
        if (name === "firstname") {
            setFirstName(capitalizeFirstLetter(value));
        } else if (name === "lastname") {
            setLastName(capitalizeFirstLetter(value));
        }
    };

    // Function to handle search input change
    const handleSearchInputChange = (ev) => {
        setSearchInput(ev.target.value);
    };

    // Function to handle search form submission
    const handleSearchSubmit = (ev) => {
        ev.preventDefault();
        setSearchQuery(searchInput);
    };

    const handleAddAdmin = () => {
        setShowModal(true);
    };
    
    const handleModalClose = () => {
        setShowModal(false);
        setErrors({}); // Reset the error message
        setFirstName(""); // Clear the first name input field
        setLastName(""); // Clear the last name input field
        setContactNumber(""); // Clear the contact number input field
        setEmail(""); // Clear the email input field
        setPassword(""); // Clear the password input field
        setPasswordConfirmation(""); // Clear the password confirmation input field
    };

    const onDeleteClick = (userId, userEmail) => {
        setDeleteConfirmation({
        isOpen: true,
        userId,
        userEmail,
        });
    };
    
    const handleDeleteConfirmation = (confirmed) => {
        if (confirmed) {
        // Perform the delete operation
        const { userId } = deleteConfirmation;
            axiosClient
            .delete(`/admin/users/${userId}`)
            .then(() => {
            // Update the users state after successful deletion
            setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
            );
            setShowAlert(true); // Show the success alert
            })
            .catch((error) => {
            console.error("Error deleting user:", error);
            });
        }
        // Reset the delete confirmation state
        setDeleteConfirmation({
            isOpen: false,
            userId: null,
            userEmail: '',
        });
    };

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

    useEffect(() => {
        axiosClient
          .get("/admin/users")
          .then(({ data }) => {
            setUsers(data.users.data);
            setTotalPages(data.users.last_page);
            setTotalCount(data.users.total); // Set the total count
            setIsLoading(false); // Set isLoading to false after fetching forms
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
            setIsLoading(false); // Set isLoading to false in case of an error
          });
      }, []);


    return (
        <PageComponent title="Users"
        buttons={( 
            <TButton color="green" onClick={handleAddAdmin}>
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Create new User
            </TButton>
        )}>

    <p className="text-sm font-medium text-gray-500 pb-4">
        <span className="inline-flex items-center">
        <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
        The following are the users in the system.
        </span>
    </p>

    <div className="flex items-center justify-end mb-4">
        <div className="mr-4">
        {/* Search by firstname, lastname, or email */}
        <form onSubmit={handleSearchSubmit}>
            <div className="relative">
                <input
                type="text"
                placeholder="Search by firstname, lastname, or email"
                className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchInput}
                onChange={handleSearchInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <MagnifyingGlassCircleIcon className="w-5 h-5" />
                </div>
            </div>
          </form>
        </div>
        <div className="mr-4">
          {/* Filter by role */}
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={roleFilter}
            onChange={(ev) => setRoleFilter(ev.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            {/* <option value="guest">Guest</option> */}
          </select>
        </div>
        {/* Display the total count */}
        <div className="text-right text-sm font-medium text-gray-500 pb-4">
            Total Count: {totalCount}
        </div>
    </div>
    
    <div className="px-4">
        {showAlert && (
            <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <div>
                    User Deleted successfully
                </div>
            </div>
        )}
    </div>

    {/* Table */}
    <table className="w-full divide-y divide-gray-200 bg-white p-6 mx-auto rounded-lg overflow-hidden">
        <thead>
            <tr>
            <th className="py-2">First Name</th>
            <th className="py-2">Last Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Role</th>
            <th className="py-2">Status</th>
            <th className="py-2"></th>
            </tr>
        </thead>
        <tbody>
        {isLoading ? ( // Check isLoading state before displaying forms
                <tr>
                  <td className="py-4 text-center text-gray-500" colSpan="6">
                    Please wait...
                  </td>
                </tr>
        ) : users.length === 0 ? (
        <tr>
            <td className="py-4 text-center text-gray-500" colSpan="6">
                {isLoading ? "Please wait..." : "No Data Available"}
            </td>
        </tr>
        ) : (
        users.map((user) => (
            <UserListItem user={user} key={user.id} 
            onDeleteClick={() => onDeleteClick(user.id, user.email)}// Pass office ID and name here
            onEditClick={() => navigate(`/admin/users/view/${user.id}`)} 
            />
            ))
            )}
        </tbody>
    </table>

    {/* Pagination */}
    <div className="flex justify-center mt-6">
        {currentPage > 1 && (
            <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="text-indigo-500 hover:text-indigo-700 mr-2"
            >
            <ChevronLeftIcon className="h-3 w-3" />
            </button>
        )}

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
            <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-2 py-1 rounded text-sm ${
                page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
                {page}
            </button>
            )
        )}

        {currentPage < totalPages && (
            <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="text-indigo-500 hover:text-indigo-700 ml-2"
            >
            <ChevronRightIcon className="h-3 w-3" />
            </button>
        )}
        </div>

        {/* MODALS */}
        {/* Display delete confirmation dialog */}
        {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-xl">
            <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" aria-hidden="true" />
                <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-700 mb-4">
                Are you sure you want to delete the user with Email:
                <span className="font-bold ml-1">{deleteConfirmation.userEmail}</span>?
            </p>
            <div className="flex justify-end space-x-4">
                <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => handleDeleteConfirmation(false)}
                >
                Cancel
                </button>
                <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteConfirmation(true)}
                >
                Delete
                </button>
            </div>
            </div>
        </div>
        )}
        {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-200 w-full max-w-md mx-auto rounded-lg shadow-lg">
            <form onSubmit={onSubmit} className="shadow sm-overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <label htmlFor="file" className="block text-sm font-medium text-indigo-700">
                    Create Admin
                </label>
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
                {/* Display success message */}
                {success && (
                <div className="flex items-center text-sm mt-2 bg-green-500 py-2 px-4 rounded text-white">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <div className="bg-green-500 py-2 px-4 rounded text-white">{success}</div>
                </div>
                )}

                <div className="grid grid-cols-6 gap-6">
                {/* Left side */}
                <div className="col-span-6 sm:col-span-3">
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

                <div className="col-span-6 sm:col-span-3">
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

                <div className="col-span-6 sm:col-span-3">
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
                        onChange={(ev) => setContactNumber(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>

                {/* Right side */}
                <div className="col-span-6 sm:col-span-3">
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
                        onChange={(ev) => setEmail(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
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
                        onChange={(ev) => setPassword(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
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
                        onChange={(ev) => setPasswordConfirmation(ev.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 pl-2 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    </div>
                </div>
                </div>

                {/* Save Button */}
                <div className="px-4 py-3 text-right sm:px-6">
                    <button onClick={handleModalClose} variant="outline" className="text-gray-500 hover:text-gray-700 mx-2">
                    Cancel
                    </button>
                    <button onClick={onSubmit} className="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded">
                    Save
                    </button>
                </div>
                {/* Update Button */}
                </div>
            </form>
            </div>
        </div>
        )}
    </PageComponent>
    )
}