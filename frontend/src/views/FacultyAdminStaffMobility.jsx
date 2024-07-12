import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, InformationCircleIcon, MagnifyingGlassCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useNavigate } from "react-router-dom";
import TButton from "../components/core/TButton";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import LogRequestListItem from "../components/LogRequestListItem";
import swal from 'sweetalert';

export default function FacultyAdminStaffMobility() {
  const role = localStorage.getItem('auth_role');
  const [log, setLog] = useState({
      name: "",
      sender_name: "",
      date_received_ovcia: "",
      dts_num: "",
      office: "",
      by_means: "",
      re_entry_plan_future_actions: "",
      status: "",
      category_id: 1,
  });
  const [offices, setOffices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // State to hold the total count
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state

  // Function to fetch offices
  const fetchLogs = (page, statusFilter, searchQuery, dateFilter, setLogs, setTotalPages) => {
    setIsLoading(true);
    let fetchPage = page;
    // Reset the page to 1 if filters or search query are applied
    if (statusFilter !== "" && searchQuery !== "" && dateFilter !== "") {
        setCurrentPage(page); // Reset current page to 1
    }else if ((statusFilter !== "" && searchQuery !== "") && dateFilter !== '') {
      setCurrentPage(1); // Reset current page to 1
    } else if ((currentPage !== 1 || statusFilter !== "") && dateFilter !== "") {
      setCurrentPage(page); // Go back to page 1
    }else if ((currentPage !== 1 || searchQuery !== "") && dateFilter !== "") {
      setCurrentPage(page); // Go back to page 1
    } else {
      setCurrentPage(page);
    }
    axiosClient
      .get(`/${role}/faculty-admin-staff-mobility?page=${fetchPage}&status=${statusFilter}&search=${searchQuery}&date=${dateFilter}`)
      .then(({ data }) => {
        setLogs(data.logs.data);
        setTotalPages(data.logs.last_page);
        setTotalCount(data.logs.total); // Set the total count
        if (data.logs.data.length === 0) {
          setIsLoading(false); // Set isLoading to false if no forms are fetched
        }
      })
      .catch((error) => {
        console.error("Error fetching requests:", error);
      })
      .finally(() => {
        setIsLoading(false); // Set isLoading to false after fetching data
      });
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Fetch offices for the selected page
    fetchLogs(page, statusFilter, searchQuery, dateFilter, setLogs, setTotalPages);
  };
  useEffect(() => {
    fetchLogs(currentPage, statusFilter, searchQuery, dateFilter, setLogs, setTotalPages);
  }, [currentPage, statusFilter, searchQuery, dateFilter]);

    const onSubmit = (ev) => {
      ev.preventDefault();
      axiosClient
        .post(`/${role}/faculty-admin-staff-mobility/add-log-request`, log)
        .then((response) => {
          setErrors({}); // Clear any previous error message
          setSuccess("Request logged successfully"); // Set the success message
          setTimeout(() => {
            handleModalClose();
          }, 2000); // Close the modal form after 2 seconds
    
          // Fetch the updated list of offices and update the state
          axiosClient
            .get(`/${role}/faculty-admin-staff-mobility`)
            .then(({ data }) => {
              setLogs(data.logs.data);
              setTotalPages(data.logs.last_page);
              setTotalCount(data.logs.total); // Set the total count
            })
            .catch((error) => {
              console.error("Error fetching requests:", error);
            })
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
      setLog((prevLog) => ({
        ...prevLog,
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
      setErrors({}); // Reset the error message
      setLog(''); // Reset the office state to its initial value
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
  axiosClient.get(`/${role}/office`).then(res => {
      if(res.data.status === 200)
      {
          setOffices(res.data.offices);
      }
  });

  axiosClient
    .get(`/${role}/faculty-admin-staff-mobility`)
    .then(({ data }) => {
      setLogs(data.logs.data);
      setTotalPages(data.logs.last_page);
      setTotalCount(data.logs.total); // Set the total count
      setIsLoading(false); // Set isLoading to false after fetching forms
    })
    .catch((error) => {
      console.error("Error fetching requests:", error);
      setIsLoading(false); // Set isLoading to false in case of an error
    });
  }, []);

    return (
        <PageComponent title="Faculty, Admin & Staff"
            buttons={( 
                <TButton color="green" onClick={handleAddForm}>
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Add Log
                </TButton>
            )}>
            
            <p className="text-sm font-medium text-gray-500 pb-4">
                <span className="inline-flex items-center">
                    <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
                    This contains the requests from Faculty, Admin & Staff
                </span>
            </p>

            <div className="flex items-center justify-end mb-4">
              <div className="mr-4">
                {/* Search by firstname, lastname, or email */}
                  <form onSubmit={handleSearchSubmit}>
                      <div className="relative">
                          <input
                          type="text"
                          placeholder="Search"
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
                  {/* Filter by status */}
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={statusFilter}
                    onChange={(ev) => setStatusFilter(ev.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
                <div className="mr-4">
                {/* Filter by date */}
                <input
                  type="date"
                  name="date"
                  value={dateFilter}
                  onChange={(ev) => setDateFilter(ev.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
                {/* Display the total count */}
                <div className="text-right text-sm font-medium text-gray-500 pb-4">
                    Total Count: {totalCount}
                </div>
            </div>
            
            {/* Table */}
            <table className="w-full divide-y divide-gray-200 bg-white p-6 mx-auto rounded-lg overflow-hidden">
                <thead>
                    <tr>
                    <th className="py-2">Request Name</th>
                    <th className="py-2">Sender Name</th>
                    <th className="py-2">Date Received in OVCIA</th>
                    <th className="py-2">End Date</th>
                    <th className="py-2">DTS Num</th>
                    <th className="py-2">PD Num</th>
                    <th className="py-2">SUC Num</th>
                    <th className="py-2">Office</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Logged By</th>
                    <th className="py-2">Date Logged</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                {isLoading ? ( // Check isLoading state before displaying forms
                <tr>
                  <td className="py-4 text-center text-gray-500" colSpan="10">
                    Please wait...
                  </td>
                </tr>
                ) : logs.length ===0 ? (
                <tr>
                    <td className="py-4 text-center text-gray-500" colSpan="10">
                    {isLoading ? "Please wait..." : "No Data Available"}
                    </td>
                </tr>
                ) : (
                  logs.map((log) => (
                    <LogRequestListItem key={log.id} log={log}
                    onEditClick={() => {
                      if (role === 'admin') {
                        navigate(`/admin/faculty-admin-staff-mobility/view/${log.id}`);
                      } else if (role === 'user') {
                        navigate(`/user/faculty-admin-staff-mobility/view/${log.id}`);
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
                <div className="bg-gray-200 w-full max-w-xl mx-auto rounded-lg shadow-lg">
                  <form onSubmit={onSubmit} className="shadow sm-overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                      <label htmlFor="log/requests" className="block text-sm font-medium text-indigo-700">
                        Add Log/Request
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

                      {/* Grid Layout */}
                      <div className="grid grid-cols-2 gap-6">
                        {/* Date Received in OVCIA */}
                        <div>
                          <label htmlFor="date_received_ovcia" className="block text-sm font-medium text-gray-700">
                            Date Received in OVCIA
                          </label>
                          <input
                            type="datetime-local"
                            name="date_received_ovcia"
                            id="date_received_ovcia"
                            value={log.date_received_ovcia}
                            onChange={handleNameChange}
                            placeholder="Date Received in OVCIA"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* DTS Num */}
                        <div>
                          <label htmlFor="dts_num" className="block text-sm font-medium text-gray-700">
                            DTS Num
                          </label>
                          <input
                            type="text"
                            name="dts_num"
                            id="dts_num"
                            value={log.dts_num}
                            onChange={handleNameChange}
                            placeholder="DTS Num"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Request Name */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Request Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={log.name}
                            onChange={handleNameChange}
                            placeholder="Request Name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Re/entry Plan or Future Actions */}
                        <div>
                          <label htmlFor="re_entry_plan_future_actions" className="block text-sm font-medium text-gray-700">
                            Re/entry Plan or Future Actions
                          </label>
                          <input
                            type="text"
                            name="re_entry_plan_future_actions"
                            id="re_entry_plan_future_actions"
                            value={log.re_entry_plan_future_actions}
                            onChange={handleNameChange}
                            placeholder="Re/entry Plan or Future Actions"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Sender Name */}
                        <div>
                          <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700">
                            Sender Name
                          </label>
                          <input
                            type="text"
                            name="sender_name"
                            id="sender_name"
                            value={log.sender_name}
                            onChange={handleNameChange}
                            placeholder="Sender Name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Office */}
                        <div>
                          <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                            Office
                          </label>
                          <select
                            id="office"
                            name="office"
                            value={log.office} // Set the initial value of the dropdown
                            onChange={handleNameChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option>Select an office</option>
                            {/* Dropdown options */}
                              {offices.map((office) => (
                                <option key={office.id} value={office.name}>
                                  {office.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* By Means */}
                        <div>
                          <label htmlFor="by_means" className="block text-sm font-medium text-gray-700">
                            By Means
                          </label>
                          <input
                            type="text"
                            name="by_means"
                            id="by_means"
                            value={log.by_means}
                            onChange={handleNameChange}
                            placeholder="By Means"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Buttons */}
                        <div className="col-span-2 flex justify-end">
                          <button onClick={handleModalClose} variant="outline" className="text-gray-500 hover:text-gray-700 mx-2">
                            Cancel
                          </button>
                          <button onClick={onSubmit} className="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
    </PageComponent>
  );
}