import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, InformationCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";
import TButton from "../components/core/TButton";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import RoleListItem from "../components/RoleListItem";

export default function RolesPermission() {
  const [roles, setRoles] = useState([]);
  const [permission, setPermission] = useState({
    name: "",
  });
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
      isOpen: false,
      permissionId: null,
      permissionName: '',
    });
    const [isLoading, setIsLoading] = useState(true); // New loading state

  //adding a new permission to a
  const onSubmit = (ev) => {
  ev.preventDefault();
  axiosClient
      .post("/admin/roles-permissions/update", permission)
      .then((response) => {
      setError(""); // Clear any previous error message
      setSuccess("Permission added successfully"); // Set the success message
      setTimeout(() => {
          handleModalClose();
      }, 2000); // Close the modal form after 2 seconds
  
      // Fetch the updated list of offices and update the state
      axiosClient
          .get("/admin/roles-permissions/update")
          .then(({ data }) => {
          setPermissions(data.data);
          })
          .catch((error) => {
          console.error("Error fetching permissions:", error);
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
        navigate("/admin/users");
      }
      console.log(error.config);
      });
    };      
  
    const handleAddPermission = () => {
      setShowModal(true);
    };

    const handleEditClick = (roleId) => {
      const roleToEdit = roles.find((role) => role.id === roleId);
      setSelectedRole(roleToEdit);
      setShowModal(true);
    };

    const capitalizeFirstLetter = (value) => {
      return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const handleNameChange = (ev) => {
      const value = capitalizeFirstLetter(ev.target.value);
      setPermission({ ...permission, name: value });
    };
    
    const handleModalClose = () => {
      setShowModal(false);
      setError(""); // Reset the error message
      setPermission({ name: "" }); // Reset the permission state to its initial value
    };

    const onDeleteClick = (permissionId, permissionName) => {
      setDeleteConfirmation({
        isOpen: true,
        permissionId,
        permissionName,
      });
    };
  
    const handleDeleteConfirmation = (confirmed) => {
      if (confirmed) {
        // Perform the delete operation
        const { permissionId } = deleteConfirmation;
          axiosClient
          .delete(`/admin/roles-permissions/${permissionId}`)
          .then(() => {
            // Update the offices state after successful deletion
            setPermissions((prevPermissions) =>
              prevPermissions.filter((permission) => permission.id !== permissionId)
            );
            setShowAlert(true); // Show the success alert
          })
          .catch((error) => {
            console.error("Error deleting permission:", error);
          });
      }
      // Reset the delete confirmation state
      setDeleteConfirmation({
          isOpen: false,
          permissionId: null,
          permissionName: '',
      });
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
    axiosClient
      .get("/admin/roles-permissions")
      .then(({ data }) => {
        setRoles(data.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);


    return (
        <PageComponent title="Roles & Permissions">
            
            {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-gray-200 w-full max-w-md mx-auto rounded-lg shadow-lg">
                <form onSubmit={onSubmit} className="shadow sm-overflow-hidden sm:rounded-md">
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

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Role Name
                      </label>
                      <div className="mt-1">
                        <span className="block bg-indigo-100 px-3 py-2 rounded-md">
                          {selectedRole?.name}
                        </span>
                      </div>
                    </div>

                    {/* Permission Name */}
                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Permission Name
                        </label>
                        <input
                        type="text"
                        name="name"
                        id="name"
                        value={permission.name}
                        onChange={handleNameChange}
                        placeholder="Permission Name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Permission Name */}

                    {permissions.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Permissions</label>
                        <ul className="mt-1">
                          {permissions.map((item, index) => (
                            <li key={index} className="bg-gray-100 px-3 py-2 rounded-md mt-1">
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

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
            
            <p className="text-sm font-medium text-gray-500 pb-4">
                <span className="inline-flex items-center">
                    <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
                    The following are the roles and permissions that is given to a user. Select a role to add/edit permissions.
                </span>
            </p>

            <div className="px-4">
            {showAlert && (
                <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <div>
                        Permission deleted successfully
                    </div>
                </div>
            )}

            {/* Table */}
            <table className="w-full divide-y divide-gray-200 bg-white p-6 mx-auto rounded-lg overflow-hidden">
                <thead>
                    <tr>
                    <th className="py-2">Role Name</th>
                    <th className="py-2">Date Created</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {roles.length === 0 ? (
                <tr>
                    <td className="py-4 text-center text-gray-500" colSpan="3">
                    {isLoading ? "Please wait..." : "No Data Available"}
                    </td>
                </tr>
                ) : (
                roles.map((role) => (
                    <RoleListItem role={role} key={role.id} onEditClick={() => handleEditClick(role.id)} />// Pass office ID and name here
                    ))
                    )}
                </tbody>
            </table>
      
            {/* Display delete confirmation dialog */}
            {deleteConfirmation.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-xl">
                <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" aria-hidden="true" />
                    <h3 className="text-lg font-medium">Confirm Deletion</h3>
                </div>
                <p className="text-gray-700 mb-4">
                    Are you sure you want to delete the Permission:
                    <span className="font-bold ml-1">{deleteConfirmation.permissionName}</span>?
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
        </div>
    </PageComponent>
  );
}