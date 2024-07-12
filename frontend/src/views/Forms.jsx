import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, MagnifyingGlassCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import TButton from "../components/core/TButton";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import FormListItem from "../components/FormListItem";
import swal from 'sweetalert';

export default function Forms() {
    // const {offices, setOffices} = useStateContext();
    const role = localStorage.getItem('auth_role');
    const [form, setForm] = useState({
        title: "",
        description: "",
    });
    const [forms, setForms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0); // State to hold the total count
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        formId: null,
        formTitle: '',
      });
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false); // New loading state

    // Function to fetch offices
    const fetchForms = (page, searchQuery, setForms, setTotalPages) => {
      setIsLoading(true);
      let fetchPage = page;
      // Reset the page to 1 if filters or search query are applied
      if (searchQuery !== "") {
        setCurrentPage(page); // Reset current page to 1
      }
      axiosClient
        .get(`/${role}/forms?page=${fetchPage}&search=${searchQuery}`)
        .then(({ data }) => {
          setForms(data.forms.data);
          setTotalPages(data.forms.last_page);
          setTotalCount(data.forms.total);
          if (data.data.length === 0) {
            setIsLoading(false); // Set isLoading to false if no forms are fetched
          }
        })
        .catch((error) => {
          console.error("Error fetching forms:", error);
          setIsLoading(false); // Set isLoading to false in case of an error
        });
    };

     // Function to handle page change
     const handlePageChange = (page) => {
      setCurrentPage(page);
  
      // Fetch offices for the selected page
      fetchForms(page, searchQuery, setForms, setTotalPages);
    };

    useEffect(() => {
      fetchForms(currentPage, searchQuery, setForms, setTotalPages);
    }, [currentPage, searchQuery]);

      const onSubmit = (ev) => {
        ev.preventDefault();
        axiosClient
          .post(`/${role}/forms/add-form`, form)
          .then((response) => {
            setError(""); // Clear any previous error message
            setSuccess("Form Module added successfully"); // Set the success message
            setTimeout(() => {
              handleModalClose();
            }, 2000); // Close the modal form after 2 seconds
      
            // Fetch the updated list of offices and update the state
            axiosClient
              .get(`/${role}/forms`)
              .then(({ data }) => {
                setForms(data.forms.data);
                setTotalPages(data.forms.last_page);
                setTotalCount(data.forms.total);
              })
              .catch((error) => {
                console.error("Error fetching form modules:", error);
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
        setForm((prevForm) => ({
          ...prevForm,
          [name]: capitalizeFirstLetter(value),
        }));
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
    
      const handleAddForm = () => {
        setShowModal(true);
      };
    
      const handleModalClose = () => {
        setShowModal(false);
        setError(""); // Reset the error message
        setForm(''); // Reset the office state to its initial value
      };

      const onDeleteClick = (formId, formTitle) => {
        setDeleteConfirmation({
          isOpen: true,
          formId,
          formTitle,
        });
      };
    
      const handleDeleteConfirmation = (confirmed) => {
        if (confirmed) {
          // Perform the delete operation
          const { formId } = deleteConfirmation;
            axiosClient
            .delete(`/${role}/forms/${formId}`)
            .then(() => {
              // Update the offices state after successful deletion
              setForms((prevForms) =>
              prevForms.filter((form) => form.id !== formId)
              );
              setShowAlert(true); // Show the success alert
            })
            .catch((error) => {
              console.error("Error deleting form:", error);
            });
        }
        // Reset the delete confirmation state
        setDeleteConfirmation({
            isOpen: false,
            formId: null,
            formTitle: '',
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
      .get(`/${role}/forms`)
      .then(({ data }) => {
        setForms(data.forms.data);
        setTotalPages(data.forms.last_page);
        setTotalCount(data.forms.total);
        setIsLoading(false); // Set isLoading to false after fetching forms
      })
      .catch((error) => {
        console.error("Error fetching forms:", error);
        setIsLoading(false); // Set isLoading to false in case of an error
      });
  }, []);

    return (
        <PageComponent title="Forms"
            buttons={( 
                <TButton color="green" onClick={handleAddForm}>
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Create New
                </TButton>
            )}>
            
            <p className="text-sm font-medium text-gray-500 pb-4">
                <span className="inline-flex items-center">
                    <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
                    Form Modules contains many files.
                </span>
            </p>
            <div className="flex items-center justify-end mb-4">
              <div className="mr-4">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by form module title"
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
                        Form Module deleted successfully
                    </div>
                </div>
            )}

            {/* Table */}
            <table className="w-full divide-y divide-gray-200 bg-white p-6 mx-auto rounded-lg overflow-hidden">
                <thead>
                    <tr>
                    <th className="py-2">Form Module Name</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Date Created</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {isLoading ? ( // Check isLoading state before displaying forms
                <tr>
                  <td className="py-4 text-center text-gray-500" colSpan="3">
                    Please wait...
                  </td>
                </tr>
                ) : forms.length ===0 ? (
                <tr>
                    <td className="py-4 text-center text-gray-500" colSpan="3">
                    No Data Available
                    </td>
                </tr>
                ) : (
                forms.map((form) => (
                    <FormListItem form={form} key={form.id}
                    onDeleteClick={() => onDeleteClick(form.id, form.title)}// Pass office ID and name here
                    onEditClick={() => {
                      if (role === 'admin') {
                        navigate(`/admin/forms/view/${form.id}`);
                      } else if (role === 'user') {
                        navigate(`/user/forms/view/${form.id}`);
                      }
                    }}
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
            {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-gray-200 w-full max-w-md mx-auto rounded-lg shadow-lg">
                <form onSubmit={onSubmit} className="shadow sm-overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <label htmlFor="file" className="block text-sm font-medium text-indigo-700">
                        Create Form Module
                    </label>
                    {/* Display error message */}
                    {error && (
                        <div className="flex items-center text-sm mt-2 bg-red-500 py-2 px-4 rounded text-white">
                        <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                        <div className="bg-red-500 py-2 px-4 rounded text-white">{error}</div>
                        </div>
                    )}
                    {/* Display success message */}
                    {success && (
                        <div className="flex items-center text-sm mt-2 bg-green-500 py-2 px-4 rounded text-white">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <div className="bg-green-500 py-2 px-4 rounded text-white">{success}</div>
                        </div>
                    )}

                    {/* Name */}
                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Form Module Name
                        </label>
                        <input
                        type="text"
                        name="title"
                        id="title"
                        value={form.title}
                        onChange={handleNameChange}
                        placeholder="Form Module Name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Name */}

                    {/* Description */}
                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                        </label>
                        <input
                        type="text"
                        name="description"
                        id="description"
                        value={form.description}
                        onChange={handleNameChange}
                        placeholder="Description"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Description */}

                    {/* Created By */}
                    {/* Created By */}

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

            {/* Display delete confirmation dialog */}
            {deleteConfirmation.isOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-xl">
                <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" aria-hidden="true" />
                    <h3 className="text-lg font-medium">Confirm Deletion</h3>
                </div>
                <p className="text-gray-700 mb-4">
                    Are you sure you want to delete the Form Module:
                    <span className="font-bold ml-1">{deleteConfirmation.formTitle}</span>?
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