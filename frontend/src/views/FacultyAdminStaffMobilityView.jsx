import { useEffect, useState } from "react";
import { ArrowUpCircleIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, DocumentIcon, ExclamationCircleIcon, ExclamationTriangleIcon, ListBulletIcon, MagnifyingGlassCircleIcon, MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import TButton from "../components/core/TButton";
import swal from 'sweetalert';
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios";
import FormFileListItem from "../components/FormFileListItem";
export default function FacultyAdminStaffMobilityView() {
    const { id } = useParams();
    const role = localStorage.getItem('auth_role');
    const navigate = useNavigate();
    const [files, setFiles] = useState([]); // Store added files
    const [file, setFile] = useState("");
    const [formInput, setFormInput] = useState({
      name: "",
      sender_name: "",
      date_received_ovcia: "",
      start_date: "",
      end_date: "",
      dts_num: "",
      pd_num: "",
      suc_num:"",
      date_submitted_ched: "",
      date_responded_ched:"",
      date_approval_ched: "",
      office: "",
      by_means: "",
      re_entry_plan_future_actions: "",
      remarks: "",
      status: "",
      created_at: "",
      updated_at: "",
      created_by: "",
      updated_by: "",
      category_id: "",
    });
    const [fileInput, setFileInput] = useState({
        document_id: id,
        file_title: "",
        file_description: "",
    });
    const [clickedFile, setClickedFile] = useState(null);
    const [authInput, setAuthInput] = useState({
      category_id: "",
      user_id: "",
      password: "",
    });
    const [offices, setOffices] = useState([]);
    const [history, setHistory] = useState([]);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [errorModal, setErrorModal] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState({
      isOpen: false,
      fileId: null,
      fileTitle: '',
    });
    const [errorAuth, setErrorAuth] = useState("");
    const [showModalAuth, setShowModalAuth] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showCheckList, setShowCheckList] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const [currentFilesPage, setCurrentFilesPage] = useState(1); // Current page for files
    const [currentHistoryPage, setCurrentHistoryPage] = useState(1); // Current page for history
    const [filesTotalPages, setFilesTotalPages] = useState(1); // Total pages for files
    const [historyTotalPages, setHistoryTotalPages] = useState(1); // Total pages for history
    const [reloadTable, setReloadTable] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    
    const onDeleteClick = (fileId, fileTitle) => {
      setDeleteConfirmation({
        isOpen: true,
        fileId,
        fileTitle,
      });
    };
  
    const handleDeleteConfirmation = (confirmed) => {
      if (confirmed) {
        // Perform the delete operation
        const { fileId } = deleteConfirmation;
          axiosClient
          .delete(`/${role}/faculty-admin-staff-mobility/view/delete/${fileId}`)
          .then(() => {
            // Update the offices state after successful deletion
            setFiles((prevFiles) =>
            prevFiles.filter((file) => file.id !== fileId)
            );
            setShowAlertModal(true); // Show the success alert
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
          });
      }
      // Reset the delete confirmation state
      setDeleteConfirmation({
          isOpen: false,
          fileId: null,
          fileTitle: '',
      });
    };

    const fetchFiles = (page, setFiles, setFilesTotalPages) => {
      if (!reloadTable) {
        return; // If reloadTable is false, do not fetch files
      }
      axiosClient
        .get(`/${role}/faculty-admin-staff-mobility/view/${id}/files?page=${page}`)
        .then(({ data }) => {
          setFiles(data.files.data);
          setFilesTotalPages(data.files.last_page);
          setReloadTable(false);
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
          setIsLoading(false);
        });
    };

    const fetchHistory = (page, searchQuery, setHistory, setHistoryTotalPages) => {
      let fetchPage = page;
      // Reset the page to 1 if filters or search query are applied
      if (searchQuery !== "") {
        setCurrentHistoryPage(page); // Reset current page to 1
      }
      axiosClient
        .get(`/${role}/faculty-admin-staff-mobility/view/${id}/history?page=${fetchPage}&search=${searchQuery}`)
        .then(({ data }) => {
          setHistory(data.history.data);
          setHistoryTotalPages(data.history.last_page);
          setReloadTable(false);
        })
        .catch((error) => {
          console.error("Error fetching history:", error);
          setReloadTable(false);
        });
    };

    //add here
    useEffect(() => {
        axiosClient
        .get(`/${role}/faculty-admin-staff-mobility/view/${id}/files`)
        .then(({ data }) => {
          setFiles(data.files.data);
          setFilesTotalPages(data.files.last_page);
          setReloadTable(false); // Reset reloadTable after fetching initial files
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
        });

        axiosClient.get(`/${role}/office`).then(res => {
          if(res.data.status === 200)
          {
              setOffices(res.data.offices);
          }
        });

        axiosClient
        .get(`/${role}/faculty-admin-staff-mobility/view/${id}/history`)
        .then(({ data }) => {
          setHistory(data.history.data);
          setHistoryTotalPages(data.history.last_page);
          setReloadTable(false); // Reset reloadTable after fetching initial files
        })
        .catch((error) => {
          console.error("Error fetching history:", error);
        });

        axiosClient.get(`/${role}/faculty-admin-staff-mobility/view/${id}`).then(res => {
            if(res.data.status === 200)
            {
                // console.log(res.data.user);
                const log = res.data.log;
                const formattedCreatedDate = log.date_received_ovcia
                    ? new Date(log.date_received_ovcia).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    : "";
                const formattedUpdatedDate = log.updated_at
                    ? new Date(log.updated_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    : "";
                setFormInput({
                    ...log,
                    date_received_ovcia: formattedCreatedDate,
                    updated_at: formattedUpdatedDate,
                });
                setIsLoading(false); // Set loading to false when data is fetched
            }
            else if (res.data.status === 404)
            {
                swal("Error", res.data.message, "error")
                navigate(`/${role}/faculty-admin-staff-mobility`);
            }
        }).catch(error => {
            swal("Error", "An error occurred while retrieving log/request data.", "error").then(() => {
                navigate(`/${role}/faculty-admin-staff-mobility`);
            });
        });
    }, [id, navigate, role]);

    // Function to handle page change
    const handleFilesPageChange = (page) => {
      setReloadTable(true);
      setCurrentFilesPage(page);

      fetchFiles(page, setFiles, setFilesTotalPages);
    };

    const handleHistoryPageChange = (page) => {
      setReloadTable(true);
      setCurrentHistoryPage(page);

      fetchHistory(page, searchQuery, setHistory, setHistoryTotalPages)
    };
    
    useEffect(() => {
      if (reloadTable) {
        fetchFiles(currentFilesPage, setFiles, setFilesTotalPages);
      }
    }, [currentFilesPage, reloadTable]);
    
    useEffect(() => {
        fetchHistory(currentHistoryPage, searchQuery, setHistory, setHistoryTotalPages);
    }, [currentHistoryPage, searchQuery, reloadTable]);

    // Function to handle search input change
    const handleSearchInputChange = (ev) => {
      setSearchInput(ev.target.value);
    };

    // Function to handle search form submission
    const handleSearchSubmit = (ev) => {
      ev.preventDefault();
      setSearchQuery(searchInput);
    };
     
    const capitalizeFirstLetter = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      };

      const handleInput = (ev) => {
        ev.persist();
        const { name, value } = ev.target;
        setFormInput((prevFormInput) => ({
          ...prevFormInput,
          [name]: capitalizeFirstLetter(value),
        }));
        setAuthInput((prevAuthInput) => ({
          ...prevAuthInput,
          [name]: capitalizeFirstLetter(value),
        }));
      };

      const handleNameChange = (ev) => {
        ev.persist();
        const { name, value } = ev.target;
        setFileInput((prevFileInput) => ({
          ...prevFileInput,
          [name]: capitalizeFirstLetter(value),
        }));
      };

      const handleRadioClick = (value) => {
        setFormInput(prevFormInput => ({
          ...prevFormInput,
          status: value,
        }));
        }

      const handleFile = (ev) => {
        const selectedFile = ev.target.files[0];
        setFile(selectedFile);
      };

    const handleAddFile = () => {
        setShowModal(true);
      };

    const handleCheckList = () => {
      setShowCheckList(true);
    };

    // Function to handle file click
    const handleFileClick = (file) => {
      setClickedFile(file);
    };

    const handleModalClose = () => {
        setShowModalAuth(false);
        setShowModal(false);
        setShowCheckList(false);
        setErrorAuth("");
        setAuthInput("");
        setErrorModal(""); // Reset the error message
        setFileInput((prevFileInput) => ({
          ...prevFileInput,
          file_title: "",
          file_description: "",
      }));
        setFile("");
      };

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

    const onSubmit = (ev) => {
      ev.preventDefault();
      setAuthInput({
        ...authInput,
        category_id: formInput.category.id, // Set the name field to the category name
        user_id: Number(localStorage.getItem('auth_userId')),
      });
        setShowModalAuth(true);
      };    

    const onSubmitForm = (ev) => {
        ev.preventDefault();

        const { category_id, user_id, password } = authInput;

        if (!password) {
          setErrorAuth("Password field is required");
          return;
        }

        axiosClient
        .post(`/${role}/category-auth`, { category_id, user_id, password })
        .then((res) => {
          if (res.data.success) {
            setSuccess("Authorized to Update"); // Set the success message
            setTimeout(() => {
              handleModalClose();
            }, 2000); // Close the modal form after 2 seconds

            const updatedLogRequest = { ...formInput };

            axiosClient
            .post(`/${role}/faculty-admin-staff-mobility/update/${id}`, updatedLogRequest, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            })
            .then((res) => {
            if (res.data.status === 200) {
                setErrors({}); // Clear any previous error message
                setShowAlert(true); // Show the success alert

                // Refetch the updated list of users and update the state
                axiosClient
                .get(`/${role}/faculty-admin-staff-mobility/view/${id}`)
                .then((res) => {
                    if (res.data.status === 200) {
                        const log = res.data.log;
                        const formattedCreatedDate = log.date_received_ovcia
                            ? new Date(log.date_received_ovcia).toLocaleString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })
                            : "";
                        const formattedUpdatedDate = log.updated_at
                            ? new Date(log.updated_at).toLocaleString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })
                            : "";
                        setFormInput({
                            ...log,
                            date_received_ovcia: formattedCreatedDate,
                            updated_at: formattedUpdatedDate,
                        });
                    } else if (res.data.status === 404) {
                    swal("Error", res.data.message, "error");
                    navigate(`/${role}/faculty-admin-staff-mobility`);
                    }
                })
                .catch((error) => {
                  swal(
                  "Error",
                  "An error occurred while retrieving user data.",
                  "error"
                  ).then(() => {
                  navigate(`/${role}/faculty-admin-staff-mobility`);
                  });
              });
              // Fetch the updated history
              axiosClient
              .get(`/${role}/faculty-admin-staff-mobility/view/${id}/history`)
              .then(({ data }) => {
                setHistory(data.history.data);
                setHistoryTotalPages(data.history.last_page);
              })
              .catch((error) => {
                console.error("Error fetching history:", error);
                setIsLoading(false);
              });
          } else if (res.data.status === 422) {
              setErrors(res.data.message); // Set the error message
              console.log("Error", res.data.error.message);
          } else if (res.data.status === 404) {
              swal("Error", res.data.message, "error");
              navigate(`/${role}/faculty-admin-staff-mobility`);
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
          }    
          else if(res.data.status === 401)
          {
            swal("Error", res.data.message, "error");
            navigate(`/${role}/faculty-admin-staff-mobility/view/${id}`);
          }
          else
          {
            setErrorAuth(res.data.message);
          }
        }
      )
  };

    const onSubmitFile = (ev) => {
        ev.preventDefault();

        //Validation check
        if ( !fileInput.document_id || !file || !fileInput.file_title || !fileInput.file_description) {
          setErrorModal("Please provide all required information.");
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_id', fileInput.document_id);
        formData.append('file_title', fileInput.file_title);
        formData.append('file_description', fileInput.file_description);

        axiosClient
        .post(`/${role}/faculty-admin-staff-mobility/add-file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
        .then((response) => {
            setErrorModal(""); // Clear any previous error message
            setSuccess("File added successfully"); // Set the success message
            setTimeout(() => {
              handleModalClose();
            }, 2000); // Close the modal form after 2 seconds
        
            // Fetch the updated list of files and update the state
            axiosClient
            .get(`/${role}/faculty-admin-staff-mobility/view/${id}/files`)
            .then(({ data }) => {
              setFiles(data.files.data); // Update the files state
              setFilesTotalPages(data.files.last_page); // Update the total pages state
              setReloadTable(true); // Set reloadTable to true to trigger fetching the updated files
            })
            .catch((error) => {
              console.error("Error fetching files:", error);
            });
        })
        .catch((error) => {
            if (error.response) {
              // The request was made and the server responded with an error status code
              setErrorModal(error.response.data.message); // Set the error message
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
      if (showAlertModal) {
      const timer = setTimeout(() => {
          setShowAlertModal(false);
      }, 3000);
      return () => {
          clearTimeout(timer);
      };
      }
  }, [showAlertModal]);

    if (isLoading) {
        return (
            <PageComponent title="Update Log/Request">
                <p>Please wait...</p>
            </PageComponent>
        );
    }

    return (
      <PageComponent title={'Update Log/Request'}>
      <div>
      {showModalAuth && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gray-200 w-full max-w-md mx-auto rounded-lg shadow-lg">
            <form onSubmit={onSubmit} className="shadow sm-overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <label htmlFor="file" className="block text-sm font-medium text-indigo-700">
                    Update
                </label>
                {errorAuth && (
                  <div className="flex items-center text-sm mt-2 bg-red-500 py-2 px-4 rounded text-white">
                    <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                    <div className="bg-red-500 py-2 px-4 rounded text-white">{errorAuth}</div>
                  </div>
                )}

                {/* Display success message */}
                {success && (
                    <div className="flex items-center text-sm mt-2 bg-green-500 py-2 px-4 rounded text-white">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      <div className="bg-green-500 py-2 px-4 rounded text-white">{success}</div>
                    </div>
                  )}

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
                            value={authInput.password}
                            onChange={handleInput}
                            placeholder="Password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    {/* Password */}

                {/* Save Button */}
                <div className="px-4 py-3 text-right sm:px-6">
                    <button onClick={handleModalClose} variant="outline" className="text-gray-500 hover:text-gray-700 mx-2">
                    Cancel
                    </button>
                    <button onClick={onSubmitForm} className="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded">
                    Save
                    </button>
                </div>
                {/* Update Button */}
                </div>
            </form>
            </div>
        </div>
        )}
        <ul className="mb-4 flex list-none flex-row flex-wrap border-b-0 pl-0" id="tabs-tab3" role="tablist" data-te-nav-ref>
          <li role="presentation">
            <a
              href="#details"
              className={`my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight ${
                activeTab === 'details'
                  ? 'text-primary border-primary dark:text-primary-400 dark:border-primary-400'
                  : 'text-neutral-500 hover:border-transparent hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-transparent dark:border-primary-400'
              }`}
              id="tabs-home-tab3"
              data-te-toggle="pill"
              data-te-target="#details"
              data-te-nav-active={activeTab === 'details' ? '' : null}
              role="tab"
              aria-controls="details"
              aria-selected={activeTab === 'details' ? 'true' : 'false'}
              onClick={() => handleTabClick('details')}
            >
              Details
            </a>
          </li>
          <li role="presentation">
            <a
              href="#files"
              className={`my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight ${
                activeTab === 'files'
                  ? 'text-primary border-primary dark:text-primary-400 dark:border-primary-400'
                  : 'text-neutral-500 hover:border-transparent hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-transparent dark:border-primary-400'
              }`}
              id="tabs-profile-tab3"
              data-te-toggle="pill"
              data-te-target="#files"
              data-te-nav-active={activeTab === 'files' ? '' : null}
              role="tab"
              aria-controls="files"
              aria-selected={activeTab === 'files' ? 'true' : 'false'}
              onClick={() => handleTabClick('files')}
            >
              Files
            </a>
          </li>
          <li role="presentation">
            <a
              href="#history"
              className={`my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight ${
                activeTab === 'history'
                  ? 'text-primary border-primary dark:text-primary-400 dark:border-primary-400'
                  : 'text-neutral-500 hover:border-transparent hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-transparent dark:border-primary-400'
              }`}
              id="tabs-profile-tab3"
              data-te-toggle="pill"
              data-te-target="#history"
              data-te-nav-active={activeTab === 'history' ? '' : null}
              role="tab"
              aria-controls="history"
              aria-selected={activeTab === 'history' ? 'true' : 'false'}
              onClick={() => handleTabClick('history')}
            >
              History
            </a>
          </li>
        </ul>
        <div className="content">
          {activeTab === 'details' && (
            <div>
              {/* Details tab content */}
              {/* First Form */}
              <div>
                <div className="shadow sm-overflow-hidden sm:rounded-md">
                  <form action="#" method="POST" onSubmit={onSubmit} className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
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
                    </div>
                      <label htmlFor="file" className="block text-sm font-medium text-indigo-700">
                        Log/Request Info
                      </label>

                      <div className="px-4">
                        {showAlert && (
                          <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <div>Log/Request Updated successfully</div>
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Logged By/Submitted By */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="created_by" className="block text-sm font-medium text-gray-700">
                            Logged By/Submitted By
                          </label>
                          <input
                            type="text"
                            name="created_by"
                            id="created_by"
                            onChange={handleInput}
                            value={`${formInput.created_by.firstname} ${formInput.created_by.lastname}`}
                            readOnly // Set input as readOnly to prevent changes
                            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm bg-indigo-100 border-gray-300"
                          />
                        </div>
                        {/* Logged By/Submitted By */}
                        
                        {/* Request Name */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Request Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInput}
                            value={formInput.name}
                            placeholder="Request Name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Request Name */}
            
                        {/* Sender Name */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="sender_name" className="block text-sm font-medium text-gray-700">
                            Sender Name
                          </label>
                          <input
                            type="text"
                            name="sender_name"
                            id="sender_name"
                            onChange={handleInput}
                            value={formInput.sender_name}
                            placeholder="Sender Name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Sender Name */}
            
                        {/* Date Received in OVCIA */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="date_received_ovcia" className="block text-sm font-medium text-gray-700">
                            Date Received in OVCIA
                          </label>
                          <input
                            type="text"
                            name="date_received_ovcia"
                            id="date_received_ovcia"
                            value={formInput.date_received_ovcia}
                            readOnly // Set input as readOnly to prevent changes
                            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm bg-indigo-100 border-gray-300"
                          />
                        </div>
                        {/* Date Received in OVCIA*/}
                        
                        {/* Start Date */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            type="datetime-local"
                            name="start_date"
                            id="start_date"
                            value={formInput.start_date}
                            onChange={handleInput}
                            placeholder="Start Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Start Date */}

                        {/* End Date */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="datetime-local"
                            name="end_date"
                            id="end_date"
                            value={formInput.end_date}
                            onChange={handleInput}
                            placeholder="End Date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* End Date */}

                        {/* DTS Num */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="dts_num" className="block text-sm font-medium text-gray-700">
                            DTS Num
                          </label>
                          <input
                            type="text"
                            name="dts_num"
                            id="dts_num"
                            onChange={handleInput}
                            value={formInput.dts_num}
                            placeholder="DTS Num"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* DTS Num */}

                        {/* PD Num */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="pd_num" className="block text-sm font-medium text-gray-700">
                            PD Num
                          </label>
                          <input
                            type="text"
                            name="pd_num"
                            id="pd_num"
                            onChange={handleInput}
                            value={formInput.pd_num}
                            placeholder="PD Num"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* PD Num */}

                        {/* SUC Num */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="suc_num" className="block text-sm font-medium text-gray-700">
                            SUC Num
                          </label>
                          <input
                            type="text"
                            name="suc_num"
                            id="suc_num"
                            onChange={handleInput}
                            value={formInput.suc_num}
                            placeholder="SUC Num"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* SUC Num */}

                        {/* Office */}
                        <div>
                          <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                            Office
                          </label>
                          <select
                            id="office"
                            name="office"
                            value={formInput.office} // Set the initial value of the dropdown
                            onChange={handleInput}
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

                       </div>

                        <div>
                        {/* Date Submitted to CHED */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="date_submitted_ched" className="block text-sm font-medium text-gray-700">
                            Date Submitted to CHED
                          </label>
                          <input
                            type="datetime-local"
                            name="date_submitted_ched"
                            id="date_submitted_ched"
                            value={formInput.date_submitted_ched}
                            onChange={handleInput}
                            placeholder="Date Submitted to CHED"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Date Submitted to CHED */}

                        {/* Date CHED Responded */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="date_responded_ched" className="block text-sm font-medium text-gray-700">
                            Date CHED Responded
                          </label>
                          <input
                            type="datetime-local"
                            name="date_responded_ched"
                            id="date_responded_ched"
                            value={formInput.date_responded_ched}
                            onChange={handleInput}
                            placeholder="Date CHED Responded"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Date CHED Responded */}

                        {/* Date CHED Approval */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="date_rapproved_ched" className="block text-sm font-medium text-gray-700">
                            Date CHED Approval
                          </label>
                          <input
                            type="datetime-local"
                            name="date_rapproved_ched"
                            id="date_approved_ched"
                            value={formInput.date_approved_ched}
                            onChange={handleInput}
                            placeholder="Date CHED Approval"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Date CHED Responded */}

                        {/* By Means */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="by_means" className="block text-sm font-medium text-gray-700">
                            By Means
                          </label>
                          <input
                            type="text"
                            name="by_means"
                            id="by_means"
                            onChange={handleInput}
                            value={formInput.by_means}
                            placeholder="By Means"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* By Means */}

                        {/* Re/entry Plans or Future Actions */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="re_entry_plan_future_actions" className="block text-sm font-medium text-gray-700">
                            Re/entry Plans or Future Actions
                          </label>
                          <input
                            type="text"
                            name="re_entry_plan_future_actions"
                            id="re_entry_plan_future_actions"
                            onChange={handleInput}
                            value={formInput.re_entry_plan_future_actions}
                            placeholder="Re/entry Plans or Future Actions"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Re/entry Plans or Future Actions */}

                        {/* Remarks/Notes */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                            Remarks/Notes
                          </label>
                          <input
                            type="text"
                            name="remarks"
                            id="remarks"
                            onChange={handleInput}
                            value={formInput.remarks}
                            placeholder="Remarks/Notes"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        {/* Remarks/Notes */}

                        {/* Status */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                        <div className="flex items-start">
                                <label
                                    htmlFor="status"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Status
                                </label>
                                <div className="flex h-5 items-center ml-4">
                                    <input 
                                        type="radio"
                                        name="status"
                                        id="pending"
                                        value="pending"
                                        checked={formInput.status === 'pending'}
                                        onChange={() => handleRadioClick('pending')}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="ml=3 text-sm">
                                    <label htmlFor="pending" className="ml-2 font-medium text-gray-700">
                                        Pending
                                    </label>
                                </div>

                                <div className="flex h-5 items-center ml-4">
                                    <input 
                                        type="radio"
                                        name="status"
                                        id="approved"
                                        value="approved"
                                        checked={formInput.status === 'approved'}
                                        onChange={() => handleRadioClick('approved')}
                                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="ml=3 text-sm">
                                    <label htmlFor="approved" className="ml-2 font-medium text-gray-700">
                                        Approved
                                    </label>
                                </div>
                            </div>
                            </div>
                        {/* Status */}
            
                        {/* Updated At */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="updated_at" className="block text-sm font-medium text-gray-700">
                            Date Updated
                          </label>
                          <input
                            type="text"
                            name="updated_at"
                            id="updated_at"
                            value={formInput.updated_at}
                            readOnly // Set input as readOnly to prevent changes
                            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm bg-indigo-100 border-gray-300"
                          />
                        </div>
                        {/* Updated At */}

                        {/* Recent Update By */}
                        <div className="col-span-6 sm:col-span-3 py-2 px-2">
                          <label htmlFor="updated_by" className="block text-sm font-medium text-gray-700">
                            Recent Update By
                          </label>
                          <input
                            type="text"
                            name="updated_by"
                            id="updated_by"
                            onChange={handleInput}
                            value={formInput.updated_by && formInput.updated_by.firstname && formInput.updated_by.lastname
                              ? `${formInput.updated_by.firstname} ${formInput.updated_by.lastname}`
                              : "None"}
                            readOnly // Set input as readOnly to prevent changes
                            className="mt-1 block w-full rounded-md shadow-sm sm:text-sm bg-indigo-100 border-gray-300"
                          />
                        </div>
                        {/* Recent Update By */}

                        {/* Update Button */}
                        <div className="px-4 py-3 text-right sm:px-6 ">
                          <TButton onClick={() => setShowModal(true)}>Save</TButton>
                        </div>
                        {/* Update Button */}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* First Form */}
            </div>
          )}
          {activeTab === 'files' && (
            <div>
              {/* Files tab content */}
              {/* ADD FILE MODAL FORM */}
              {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="bg-gray-200 border border-gray-200 w-full max-w-md mx-auto shadow-lg">
                    <form action="#" method="POST" onSubmit={onSubmitFile} className="shadow sm-overflow-hidden sm:rounded-md">
                    <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <label htmlFor="add file" className="block text-sm font-medium text-indigo-700">
                        Add File
                    </label>
                      {/* Display error message */}
                      {errorModal && (
                        <div className="flex items-center text-sm mt-2 bg-red-500 py-2 px-4 rounded text-white">
                          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                          <div className="bg-red-500 py-2 px-4 rounded text-white">{errorModal}</div>
                        </div>
                      )}
                      {/* Display success message */}
                      {success && (
                        <div className="flex items-center text-sm mt-2 bg-green-500 py-2 px-4 rounded text-white">
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          <div className="bg-green-500 py-2 px-4 rounded text-white">{success}</div>
                        </div>
                      )}
          
                      {/* Title */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="file_title" className="block text-sm font-medium text-gray-700">
                          File Name
                        </label>
                        <input
                          type="text"
                          name="file_title"
                          id="file_title"
                          onChange={handleNameChange}
                          value={fileInput.file_title}
                          placeholder="File Name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      {/* Title */}
          
                      {/* Description */}
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="file_description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <input
                          type="text"
                          name="file_description"
                          id="file_description"
                          onChange={handleNameChange}
                          value={fileInput.file_description}
                          placeholder="Description"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      {/* Description */}
          
                      {/* Choose File */}
                      <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                          File
                      </label>
                      <div className="flex items-center">
                          <input
                          id="file"
                          type="file"
                          onChange={handleFile} // Use handleFile to handle file selection
                          name="file"
                          className="hidden"
                          multiple
                          />
                          <label
                          htmlFor="file"
                          className="relative px-4 py-2 mt-1 text-sm bg-white border border-indigo-500 text-indigo-500 rounded-md cursor-pointer hover:bg-indigo-500 hover:text-white flex items-center"
                          >
                          <span className="mr-2">
                              <ArrowUpCircleIcon className="h-4 w-4" />
                          </span>
                          Choose File
                          </label>
                          {file && 
                            <span className="ml-2">{file.name}</span>
                          }
                      </div>
                      </div>
                      {/* Choose File */}
            
                        {/* Update Button */}
                        <div className="px-4 py-3 text-right sm:px-6">
                              <button onClick={handleModalClose} variant="outline" className="text-gray-500 hover:text-gray-700 mx-2">
                                  Cancel
                              </button>
                              <button onClick={onSubmitFile} className="text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-4 rounded">
                                  Save
                              </button>
                              </div>
                        {/* Update Button */}
                      </div>
                    </form>
                  </div>
                </div>
                )}

                {showCheckList && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-200 border border-gray-200 w-full max-w-md mx-auto shadow-lg">
                      <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                        <label htmlFor="add file" className="block text-sm font-medium text-indigo-700">
                          List of Required Documents (some may be optional)
                        </label>
                        <div>
                          <ol className="list-decimal list-inside text-gray-700 text-sm">
                            <li>Travel Request Letter</li>
                            <li>IAS Form No.5</li>
                            <li>Invitation Letter (from the organizer)</li>
                            <li>Profile of Organizer</li>
                            <li>Background Information of the Event</li>
                            <li>Abstract</li>
                            <li>Letter of Acceptance (for Oral/Paper Presentation)</li>
                            <li>Publication Proof</li>
                            <li>Report of Undertaking or Terminal Report</li>
                          </ol>
                        </div>
                        {/* Close Button */}
                        <div className="px-4 py-3 text-right sm:px-6">
                          <button onClick={handleModalClose} variant="outline" className="text-gray-500 hover:text-gray-700 mx-2">
                            Close
                          </button>
                        </div>
                        {/* Close Button */}
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
                          Are you sure you want to delete the file:
                          <span className="font-bold ml-1">{deleteConfirmation.fileTitle}</span>?
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
              {/* Left Side*/}
              <div>
                <div className="shadow sm-overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-8"></div>
                      <div>
                        <label htmlFor="file-page" className="block text-sm pl-4 font-medium text-indigo-700">
                          Log/Request Files
                        </label>

                        <div className="px-4">
                          {showAlert && (
                            <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                              <CheckCircleIcon className="h-5 w-5 mr-2" />
                              <div>File Added successfully</div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                          <div className="flex items-center">
                              <div className="mr-2">
                                  <TButton color="green" onClick={handleAddFile}>
                                      <PlusCircleIcon className="h-5 w-5" />
                                      Add File
                                  </TButton>
                              </div>
                              <div className="ml-2">
                                  <TButton color="green" onClick={handleCheckList}>
                                      <ListBulletIcon className="h-5 w-5" />
                                  </TButton>
                              </div>
                          </div>
                      </div>

                      <div className="px-4">
                        {showAlertModal && (
                          <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                            <div>File Deleted successfully</div>
                          </div>
                        )}
                      </div>

                      {/* Display the files in a table */}
                      <div className="mx-2">
                        <div className="mt-2">
                            <table className="w-full bg-white border border-gray-100 rounded-lg shadow px-4 py-2">
                                <thead>
                                    <tr>
                                        <th className="py-2 bg-gray-100">Title</th>
                                        <th className="py-2 bg-gray-100">Description</th>
                                        <th className="py-2 bg-gray-100">Created At</th>
                                        <th className="bg-gray-100"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                {reloadTable ? (
                                  <tr>
                                    <td className="py-4 text-center text-gray-100" colSpan="3">
                                      Please wait...
                                    </td>
                                  </tr>
                                ) : files.length === 0 ? (
                                  <tr>
                                    <td className="py-4 text-center text-gray-500" colSpan="3">
                                      No Files Available
                                    </td>
                                  </tr>
                                ) : (
                                  files.map((file) => (
                                    <FormFileListItem
                                      key={file.id}
                                      file={file}
                                      onDeleteClick={onDeleteClick}
                                      onFileClick={handleFileClick}
                                    />
                                  ))
                                )}
                                </tbody>
                            </table>
                            </div>
                            {/* Pagination */}
                            <div className="flex justify-center mt-6">
                              {currentFilesPage > 1 && (
                                <button
                                  onClick={() => handleFilesPageChange(currentFilesPage - 1)}
                                  className="text-indigo-500 hover:text-indigo-700 mr-2"
                                >
                                  <ChevronLeftIcon className="h-3 w-3" />
                                </button>
                              )}

                              {Array.from({ length: filesTotalPages }, (_, index) => index + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => handleFilesPageChange(page)}
                                  className={`mx-1 px-2 py-1 rounded text-sm ${
                                    page === currentFilesPage
                                      ? "bg-indigo-500 text-white"
                                      : "bg-white text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}

                              {currentFilesPage < filesTotalPages && (
                                <button
                                  onClick={() => handleFilesPageChange(currentFilesPage + 1)}
                                  className="text-indigo-500 hover:text-indigo-700 ml-2"
                                >
                                  <ChevronRightIcon className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                        </div>
                        </div>
                        {/* Right Side */}
                        {/* File Preview */}
                        <div className="col-span-7">
                        <div>
                        <label htmlFor="file" className="block text-sm pl-4 text-gray-500 bg-gray-200 py-1 px-2 rounded">
                            File Preview
                        </label>

                        {clickedFile ? (
                          <div className="mt-2">
                            <iframe
                              src={`http://localhost:8000/${clickedFile.file}`}
                              title={clickedFile.file_title}
                              className="w-full h-96"
                            />
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center justify-center h-96">
                            <DocumentIcon className="h-20 w-20 text-gray-300" />
                          </div>
                        )}

                          {/* Display the file details below the File Preview */}
                          {clickedFile && (
                            <div className="mt-2">
                              <p className="text-sm">Title: {clickedFile.file_title}</p>
                              <p className="text-sm">Added By: {`${clickedFile.added_by.firstname} ${clickedFile.added_by.lastname}`}</p>
                              {/* <p>Description: {clickedFile.file_description}</p>
                              <p>Created At: {files.formattedDate}</p> */}
                            </div>
                          )}
                        </div> 
                      </div>  
                    </div>       
                  </div>
                </div>
              </div>
          </div>
          )}
          {activeTab === 'history' && (
            <div className="mb-4">
              <div className="flex items-center justify-end mb-4">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search history"
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
            <ul role="list" className="divide-y divide-gray-100">
              {reloadTable ? (
                <div>Please wait...</div>
              ) : history && history.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-100">
                  {history.map((record) => (
                    <li
                      key={record.id}
                      className="flex justify-between items-center gap-x-6 py-5 mb-3 bg-white rounded-lg shadow"
                    >
                      {/* Display the record information */}
                    <div className="flex items-center gap-x-4 mx-6">
                      <ClockIcon className="h-6 w-6 text-gray-500" />
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {record.name} 
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-1">
                        <div>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Sender: {record.sender_name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Date Received: {""}
                          {record.date_received_ovcia && (
                            new Date(record.date_received_ovcia).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Start Date: {""}
                          {record.start_date && (
                            new Date(record.start_date).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          End Date: {""}
                          {record.end_date && (
                            new Date(record.end_date).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          )}
                        </p>
                        {/* Add more data fields as needed */}
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          DTS Number: {record.dts_num}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          PD Number: {record.pd_num}
                        </p>
                        </div>
                        <div>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          SUC Number: {record.suc_num}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Date Submitted (CHED): {""}
                          {record.date_submitted_ched && (
                            new Date(record.date_submitted_ched).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Date Responded (CHED): {""}
                          {record.date_responded_ched && (
                            new Date(record.date_responded_ched).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Date Approval (CHED): {""}
                          {record.date_approval_ched && (
                            new Date(record.date_approval_ched).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Office: {record.office}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          By Means: {record.by_means}
                        </p>
                        </div>
                        <div>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Re-entry Plan/Future Actions: {record.re_entry_plan_future_actions}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Remarks: {record.remarks}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Created At: {""}
                          {new Date(record.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Updated At: {""}
                          {record.updated_at && (
                            new Date(record.updated_at).toLocaleString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Updated By: {record.updated_by && record.updated_by.firstname && record.updated_by.lastname
                            ? `${record.updated_by.firstname} ${record.updated_by.lastname}`
                            : "None"}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Status: {record.status === "pending" ? (
                            <span className="text-yellow-500">
                              <MinusCircleIcon className="h-5 w-5 inline-block" /> Pending
                            </span>
                          ) : record.status === "approved" ? (
                            <span className="text-green-500">
                              <CheckCircleIcon className="h-5 w-5 inline-block" /> Approved
                            </span>
                          ) : (
                            <span>{record.status}</span>
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          Operation: {record.operation}
                        </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                ))}
                </ul>
              ) : (
                <div>No History available</div>
              )}
            </ul>
            {/* Pagination */}
            <div className="flex justify-center mt-6">
              {currentHistoryPage > 1 && (
                <button
                  onClick={() => handleHistoryPageChange(currentHistoryPage - 1)}
                  className="text-indigo-500 hover:text-indigo-700 mr-2"
                >
                  <ChevronLeftIcon className="h-3 w-3" />
                </button>
              )}

              {Array.from({ length: historyTotalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleHistoryPageChange(page)}
                  className={`mx-1 px-2 py-1 rounded text-sm ${
                    page === currentHistoryPage
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              {currentHistoryPage < historyTotalPages && (
                <button
                  onClick={() => handleHistoryPageChange(currentHistoryPage + 1)}
                  className="text-indigo-500 hover:text-indigo-700 ml-2"
                >
                  <ChevronRightIcon className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </PageComponent>
  );
}