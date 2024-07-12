import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import TButton from "../components/core/TButton";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import CategoryListItem from "../components/CategoryListItem";
import swal from 'sweetalert';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [categoryInput, setCategoryInput] = useState({
    id: '',
    user_id: '',
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    userId: null,
    userEmail: '',
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Add this.
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  //adding a new permission to a
  const onSubmit = (ev) => {
  ev.preventDefault();
  console.log(categoryInput);
  axiosClient
  .post(`/admin/categories/update/${categoryInput.id}`, categoryInput)
    .then((response) => {
    setError(""); // Clear any previous error message
    setSuccess("Category updated successfully"); // Set the success message
    setTimeout(() => {
        handleModalClose();
    }, 2000); // Close the modal form after 2 seconds

    // Fetch the updated list of offices and update the state
    axiosClient
        .get("/admin/categories")
        .then(({ data }) => {
        setCategories(data.data);
        })
        .catch((error) => {
        console.error("Error fetching categories:", error);
        })
    })
    .catch((error) => {
    if (error.response) {
        // The request was made and the server responded with an error status code
        setError(error.response.data.message); // Set the error message
        console.log(error.response.data);
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
    } else {
        // Something happened in setting up the request that triggered an error
      swal("Error", res.data.message, "error")
      navigate("/admin/categories");
    }
    console.log(error.config);
    });
  };      

    const handleEditClick = (categoryId) => {
      axiosClient
      .get(`/admin/categories/${categoryId}`)
      .then(({ data }) => {
        setCategoryInput((prevCategoryInput) => ({
          ...prevCategoryInput,
          id: categoryId,
        }));
        setSelectedCategory(data.category);
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error fetching category:", error);
      });
    };

    const handleInput = (ev) => {
      ev.persist();
      setCategoryInput((prevCategoryInput) => ({
        ...prevCategoryInput,
        [ev.target.name]: ev.target.value === "" ? null : Number(ev.target.value),
      }));
    };    

    const handleRemoveUser = (userId) => {
      const user = selectedCategory.users.find((user) => user.id === userId);
      if (user) {
        setDeleteConfirmation({
          isOpen: true,
          userId: user.id,
          userEmail: user.email,
        });
      }
    };    

    const handleDeleteConfirmation = (confirmed) => {
      if (confirmed) {
        const { userId } = deleteConfirmation;
        const user = selectedCategory.users.find((user) => user.id === userId);
        if (user) {
          setDeleteConfirmation((prevDeleteConfirmation) => ({
            ...prevDeleteConfirmation,
            userEmail: user.email,
          }));
    
          axiosClient
            .delete(`/admin/categories/${selectedCategory.id}/users/${userId}`)
            .then(() => {
              // Update the selectedCategory state after successful removal
              setSelectedCategory((prevCategory) => ({
                ...prevCategory,
                users: prevCategory.users.filter((user) => user.id !== userId),
              }));
              setShowAlert(true); // Show the success alert
            })
            .catch((error) => {
              console.error("Error removing user from category:", error);
            });
        }
      }
      // Reset the delete confirmation state
      setDeleteConfirmation({
        isOpen: false,
        userId: null,
        userEmail: '',
      });
    };
    
    const capitalizeFirstLetter = (value) => {
      return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const handleNameChange = (ev) => {
      setCategoryInput((prevCategoryInput) => ({
        ...prevCategoryInput,
        name: ev.target.value, // Update the name directly without capitalizing
      }));
    };
    
    const handleModalClose = () => {
      setShowModal(false);
      setError(""); // Reset the error message
      setCategoryInput(""); // Reset the permission state to its initial value
    };

  //after successfully deleting a permission
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

  //to fetch roles
  useEffect(() => {
    axiosClient.get(`/admin/all-users`).then(res => {
      if(res.data.status === 200)
      {
          setUsers(res.data.users);
      }
    });
  
    axiosClient
      .get("/admin/categories")
      .then(({ data }) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);


    return (
        <PageComponent title="Password Management">
            
            {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <label htmlFor="file" className="block text-sm font-medium text-indigo-700">
                    Update
                  </label>
                  {error && (
                    <div className="flex items-center text-sm mt-2 bg-red-500 py-2 px-4 rounded text-white">
                      <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                      <div className="bg-red-500 py-2 px-4 rounded text-white">{error}</div>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center text-sm mt-2 bg-green-500 py-2 px-4 rounded text-white">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <div className="bg-green-500 py-2 px-4 rounded text-white">{success}</div>
                    </div>
                  )}

                  {/* Category Name */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Category Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={selectedCategory.name}
                      readOnly // Set input as readOnly to prevent changes
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm bg-indigo-100 border-gray-300"
                    />
                  </div>
                  {/* Category Name */}

                  {/* User */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700">
                      User
                    </label>

                    <select
                      id="user"
                      name="user_id" // Update the name to "user_id"
                      value={categoryInput.user_id} // Set the initial value of the dropdown
                      onChange={handleInput}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a user</option> {/* Add a default option */}
                      {/* Render the users as dropdown options */}
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstname} {user.lastname}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* User */}

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

                {/* Display the selected users */}
              {selectedCategory.users && selectedCategory.users.length > 0 && (
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">Assigned Users:</div>
                  <ul className="list-disc pl-6">
                    {selectedCategory.users.map((user) => (
                      <li key={user.id} className="text-sm text-gray-600 flex items-center justify-between">
                        <span>
                          {user.firstname} {user.lastname}
                        </span>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
            </div>
          )}
            {/* Display delete confirmation dialog */}
            {deleteConfirmation.isOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-xl">
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" aria-hidden="true" />
                    <h3 className="text-lg font-medium">Confirm Deletion</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to remove the assigned user with Email:
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
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Display delete confirmation dialog */}
            {deleteConfirmation.isOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-xl">
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" aria-hidden="true" />
                    <h3 className="text-lg font-medium">Confirm Deletion</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to remove the assigned user with Email:
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
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-sm font-medium text-gray-500 pb-4">
                <span className="inline-flex items-center">
                    <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
                    The following are the categories of Expert Faculty Profile Mobility
                </span>
            </p>

            <div className="px-4">
            {showAlert && (
                <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <div>
                        Category Updated Sucessfully
                    </div>
                </div>
            )}

            {/* Table */}
            <table className="w-full divide-y divide-gray-200 bg-white p-6 mx-auto rounded-lg overflow-hidden">
                <thead>
                    <tr>
                    <th className="py-2">Category Name</th>
                    <th className="py-2">Date Updated</th>
                    <th className="py-2">Updated By</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {categories.length === 0 ? (
                <tr>
                    <td className="py-4 text-center text-gray-500" colSpan="3">
                    {isLoading ? "Please wait..." : "No Data Available"}
                    </td>
                </tr>
                ) : (
                categories.map((category) => (
                    <CategoryListItem category={category} key={category.id} onEditClick={() => handleEditClick(category.id)} />// Pass office ID and name here
                    ))
                    )}
                </tbody>
            </table>
            
        </div>
    </PageComponent>
  );
}