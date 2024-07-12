import { useEffect, useState } from "react";
import { ArrowUpCircleIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, ExclamationTriangleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import TButton from "../components/core/TButton";
import swal from 'sweetalert';
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios";
import FormFileListItem from "../components/FormFileListItem";

export default function FormView() {
    const { id } = useParams();
    const role = localStorage.getItem('auth_role');
    const navigate = useNavigate();
    const [files, setFiles] = useState([]); // Store added files
    const [file, setFile] = useState("");
    const [fileInput, setFileInput] = useState({
        form_id: id,
        file_title: "",
        file_description: "",
    });
    const [formInput, setFormInput] = useState({
        title: "",
        description: "",
        created_at: "",
        updated_at: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [errorModal, setErrorModal] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteConfirmation, setDeleteConfirmation] = useState({
      isOpen: false,
      fileId: null,
      fileTitle: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const [reloadTable, setReloadTable] = useState(false);

    
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
          .delete(`/${role}/forms/view/delete/${fileId}`)
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

    const fetchFiles = (page, setFiles, setTotalPages) => {
      if (!reloadTable) {
        return; // If reloadTable is false, do not fetch files
      }
      axiosClient
        .get(`/${role}/forms/view/${id}/files?page=${page}`)
        .then(({ data }) => {
          setFiles(data.files.data);
          setTotalPages(data.files.last_page);
          setReloadTable(false);
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
          setIsLoading(false);
        });
    };    

    //add here
    useEffect(() => {
        axiosClient
        .get(`/${role}/forms/view/${id}/files`)
        .then(({ data }) => {
          setFiles(data.files.data);
          setTotalPages(data.files.last_page);
          setReloadTable(false); // Reset reloadTable after fetching initial files
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
        });

        axiosClient.get(`/${role}/forms/view/${id}`).then(res => {
            if(res.data.status === 200)
            {
                // console.log(res.data.user);
                const form = res.data.form;
                const formattedCreatedDate = form.created_at
                    ? new Date(form.created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    : "";
                const formattedUpdatedDate = form.updated_at
                    ? new Date(form.updated_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })
                    : "";
                setFormInput({
                    ...form,
                    created_at: formattedCreatedDate,
                    updated_at: formattedUpdatedDate,
                });
                setIsLoading(false); // Set loading to false when data is fetched
            }
            else if (res.data.status === 404)
            {
                swal("Error", res.data.message, "error")
                navigate("/${role}/forms");
            }
        }).catch(error => {
            swal("Error", "An error occurred while retrieving form module data.", "error").then(() => {
                navigate("/${role}/forms");
            });
        });
    }, [id, navigate]);

    // Function to handle page change
    const handlePageChange = (page) => {
      setReloadTable(true); // Set reloadTable to true before fetching files
      setCurrentPage(page);
  
      // // Fetch offices for the selected page
      // fetchFiles(page, setFiles, setTotalPages);
    };

    useEffect(() => {
      if (reloadTable) {
        fetchFiles(currentPage, setFiles, setTotalPages);
      }
    }, [currentPage, reloadTable]);
     
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
      };

      const handleNameChange = (ev) => {
        ev.persist();
        const { name, value } = ev.target;
        setFileInput((prevFileInput) => ({
          ...prevFileInput,
          [name]: capitalizeFirstLetter(value),
        }));
      };

      const handleFile = (ev) => {
        const selectedFile = ev.target.files[0];
        setFile(selectedFile);
      };

    const handleAddFile = () => {
        setShowModal(true);
      };

    const handleModalClose = () => {
        setShowModal(false);
        setErrorModal(""); // Reset the error message
        setFileInput((prevFileInput) => ({
          ...prevFileInput,
          file_title: "",
          file_description: "",
      }));
        setFile("");
      };

    const onSubmit = (ev) => {
        ev.preventDefault();

        const updatedFormModule = { ...formInput };

        axiosClient
        .post(`/${role}/forms/update-form/${id}`, updatedFormModule, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        })
        .then((res) => {
        if (res.data.status === 200) {
            setError("");
            setShowAlert(true); // Show the success alert

            // Refetch the updated list of users and update the state
            axiosClient
            .get(`/${role}/forms/view/${id}`)
            .then((res) => {
                if (res.data.status === 200) {
                    const form = res.data.form;
                    const formattedCreatedDate = form.created_at
                        ? new Date(form.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })
                        : "";
                    const formattedUpdatedDate = form.updated_at
                        ? new Date(form.updated_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })
                        : "";
                    setFormInput({
                        ...form,
                        created_at: formattedCreatedDate,
                        updated_at: formattedUpdatedDate,
                    });
                } else if (res.data.status === 404) {
                swal("Error", res.data.message, "error");
                navigate("/${role}/forms");
                }
            })
            .catch((error) => {
                swal(
                "Error",
                "An error occurred while retrieving user data.",
                "error"
                ).then(() => {
                navigate("/${role}/forms");
                });
            });
        } else if (res.data.status === 422) {
            setError(res.data.message); // Set the error message
            console.log("Error", res.data.error.message);
        } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
            navigate("/${role}/forms");
        }
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

    const onSubmitFile = (ev) => {
        ev.preventDefault();

        //Validation check
        if ( !fileInput.form_id || !file || !fileInput.file_title || !fileInput.file_description) {
          setErrorModal("Please provide all required information.");
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('form_id', fileInput.form_id);
        formData.append('file_title', fileInput.file_title);
        formData.append('file_description', fileInput.file_description);

        axiosClient
        .post(`/${role}/forms/add-file`, formData, {
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
            .get(`/${role}/forms/view/${id}/files`)
            .then(({ data }) => {
              setFiles(data.files.data); // Update the files state
              setTotalPages(data.files.last_page); // Update the total pages state
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
            <PageComponent title="Update Form Module">
                <p>Please wait...</p>
            </PageComponent>
        );
    }

    return (
        <PageComponent title={"Update Form Module"}>
          <div className="grid grid-cols-2 gap-4">
            {/* First Form */}
            <div>
              <div className="shadow sm-overflow-hidden sm:rounded-md">
              <form action="#" method="POST" onSubmit={onSubmit}>
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <label htmlFor="file" className="block text-sm font-medium text-indigo-700">
                    Form Module Info
                </label>
                  {/* Display error message */}
                  {error && (
                    <div className="flex items-center text-sm mt-2 bg-red-500 py-2 px-4 rounded text-white">
                      <ExclamationCircleIcon className="h-5 w-5 mr-2" />
                      <div className="bg-red-500 py-2 px-4 rounded text-white">{error}</div>
                    </div>
                  )}
      
                  <div className="px-4">
                    {showAlert && (
                      <div className="flex items-center fixed bottom-4 right-4 bg-green-500 text-white py-4 px-6 rounded">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <div>Form Module Updated successfully</div>
                      </div>
                    )}
                  </div>
      
                  {/* Title */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      onChange={handleInput}
                      value={formInput.title}
                      placeholder="Title"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {/* Title */}
      
                  {/* Description */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      onChange={handleInput}
                      value={formInput.description}
                      placeholder="Description"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {/* Description */}
      
                  {/* Created At */}
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="created_at" className="block text-sm font-medium text-gray-700">
                      Date Created
                    </label>
                    <input
                      type="text"
                      name="created_at"
                      id="created_at"
                      value={formInput.created_at}
                      readOnly // Set input as readOnly to prevent changes
                      className="mt-1 block w-full rounded-md shadow-sm sm:text-sm bg-indigo-100 border-gray-300"
                    />
                  </div>
                  {/* Created At */}
      
                  {/* Updated At */}
                  <div className="col-span-6 sm:col-span-3">
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
      
                  {/* Update Button */}
                  <div className="px-4 py-3 text-right sm:px-6">
                    <TButton>Save</TButton>
                  </div>
                  {/* Update Button */}
                </div>
                </form>
              </div>
            </div>
            {/* First Form */}
      
            {/* ADD FILE MODAL FORM */}
            {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-gray-200 w-full max-w-md mx-auto rounded-lg shadow-lg">
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

            {/* New Form */}
            <div className="shadow sm-overflow-hidden sm:rounded-md bg-white">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <TButton color="green" onClick={handleAddFile}>
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add File
                </TButton>
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
                <div className="mx-4">
                  <h4 className="text-xl font-semibold">Files</h4>
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
                              <td className="py-4 text-center text-gray-500" colSpan="3">
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
                              />
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
                  </div>
              </div>
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

                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
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
                ))}

                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="text-indigo-500 hover:text-indigo-700 ml-2"
                  >
                    <ChevronRightIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
              </div>
            {/* New Form */}
          </div>
        </PageComponent>
      );      
}
