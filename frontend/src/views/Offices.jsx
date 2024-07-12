import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, MagnifyingGlassCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";
import TButton from "../components/core/TButton";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import OfficeListItem from "../components/OfficeListItem";
import swal from 'sweetalert';

export default function Offices() {
    // const {offices, setOffices} = useStateContext();
    const role = localStorage.getItem('auth_role');// Get the user's role from the context
    const [office, setOffice] = useState({
        name: "",
    });
    const [offices, setOffices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0); // State to hold the total count
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        isOpen: false,
        officeId: null,
        officeName: '',
      });
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    // Function to fetch offices
    const fetchOffices = (page, searchQuery, setOffices, setTotalPages) => {
      setIsLoading(true);
      let fetchPage = page;
      // Reset the page to 1 if filters or search query are applied
      if (searchQuery !== "") {
          setCurrentPage(page); // Reset current page to 1
      }
      axiosClient
      .get(`/${role}/offices?page=${fetchPage}&search=${searchQuery}`) // Use the user's role in the API request URL
        .then(({ data }) => {
          setOffices(data.offices.data);
          setTotalPages(data.offices.last_page);
          setTotalCount(data.offices.total);
          if (data.data.length === 0) {
            setIsLoading(false); // Set isLoading to false if no forms are fetched
          }
        })
        .catch((error) => {
          console.error("Error fetching offices:", error);
          setIsLoading(false); // Set isLoading to false in case of an error
        });
    };

    // Function to handle page change
    const handlePageChange = (page) => {
      setCurrentPage(page);

      // Fetch offices for the selected page
      fetchOffices(page, searchQuery, setOffices, setTotalPages);
    };

    useEffect(() => {
      fetchOffices(currentPage, searchQuery, setOffices, setTotalPages);
    }, [currentPage, searchQuery]);

    const onSubmit = (ev) => {
      ev.preventDefault();
      axiosClient
      .post(`/${role}/offices/add-office`, office) // Use the user's role in the API request URL
        .then((response) => {
          setError(""); // Clear any previous error message
          setSuccess("Office added successfully"); // Set the success message
          setTimeout(() => {
            handleModalClose();
          }, 2000); // Close the modal form after 2 seconds
    
          // Fetch the updated list of offices and update the state
          axiosClient
            .get(`/${role}/offices`)
            .then(({ data }) => {
              setOffices(data.offices.data);
              setTotalPages(data.offices.last_page);
              setTotalCount(data.offices.total);
            })
            .catch((error) => {
              console.error("Error fetching offices:", error);
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
      const value = capitalizeFirstLetter(ev.target.value);
      setOffice({ ...office, name: value });
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
  
    const handleAddOffice = () => {
      setShowModal(true);
    };
  
    const handleModalClose = () => {
      setShowModal(false);
      setError(""); // Reset the error message
      setOffice({ name: "" }); // Reset the office state to its initial value
    };

    const onDeleteClick = (officeId, officeName) => {
      setDeleteConfirmation({
        isOpen: true,
        officeId,
        officeName,
      });
    };
  
    const handleDeleteConfirmation = (confirmed) => {
      if (confirmed) {
        // Perform the delete operation
        const { officeId } = deleteConfirmation;
          axiosClient
          .delete(`/${role}/offices/${officeId}`)
          .then(() => {
            // Update the offices state after successful deletion
            setOffices((prevOffices) =>
              prevOffices.filter((office) => office.id !== officeId)
            );
            setShowAlert(true); // Show the success alert
          })
          .catch((error) => {
            console.error("Error deleting office:", error);
          });
      }
      // Reset the delete confirmation state
      setDeleteConfirmation({
          isOpen: false,
          officeId: null,
          officeName: '',
      });
    };

  useEffect(() => {
    axiosClient
      .get(`/${role}/offices`)
      .then(({ data }) => {
        setOffices(data.offices.data);
        setTotalPages(data.offices.last_page);
        setTotalCount(data.offices.total); // Set the total count
        setIsLoading(false); // Set isLoading to false after fetching forms
      })
      .catch((error) => {
        console.error("Error fetching offices:", error);
        setIsLoading(false); // Set isLoading to false in case of an error
      });
  }, []);

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

    return (
        <PageComponent title="Offices"
            buttons={( 
                <TButton color="green" onClick={handleAddOffice}>
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Add office
                </TButton>
            )}>
            
            <p className="text-sm font-medium text-gray-500 pb-4">
                <span className="inline-flex items-center">
                    <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
                    The following are the offices or organizations where the documents or requests are from.
                     You can only delete offices or organizations. Editing or updating is not available.
                </span>
            </p>
            <div className="flex items-center justify-end mb-4">
              <div className="mr-4">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by office name"
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
                        Office deleted successfully
                    </div>
                </div>
            )}

            {/* Table */}
            <table className="w-full divide-y divide-gray-200 bg-white p-6 mx-auto rounded-lg overflow-hidden">
                <thead>
                    <tr>
                    <th className="py-2">Office Name</th>
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
                ) : offices.length === 0 ? (
                <tr>
                    <td className="py-4 text-center text-gray-500" colSpan="3">
                    {isLoading ? "Please wait..." : "No Data Available"}
                    </td>
                </tr>
                ) : (
                offices.map((office) => (
                    <OfficeListItem office={office} key={office.id} onDeleteClick={() => onDeleteClick(office.id, office.name)} />// Pass office ID and name here
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
                        Create Office
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Office Name
                        </label>
                        <input
                        type="text"
                        name="name"
                        id="name"
                        value={office.name}
                        onChange={handleNameChange}
                        placeholder="Office Name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Name */}

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
                    Are you sure you want to delete the Office:
                    <span className="font-bold ml-1">{deleteConfirmation.officeName}</span>?
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