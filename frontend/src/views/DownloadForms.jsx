import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, useNavigate } from "react-router-dom";
import TButton from "../components/core/TButton";
import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import { ArrowDownTrayIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export default function DownloadForms() {
  const [forms, setForms] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  // Function to fetch forms
  const fetchForms = () => {
    setIsLoading(true);
    axiosClient
      .get(`/download-forms`)
      .then(({ data }) => {
        setForms(data.forms.data);
        setIsLoading(false); // Set isLoading to false after fetching forms
      })
      .catch((error) => {
        console.error("Error fetching forms:", error);
        setIsLoading(false); // Set isLoading to false in case of an error
      });
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen w-full">
    <PageComponent title="Download">
      <p className="text-sm font-medium text-gray-500 pb-4">
        <span className="inline-flex items-center">
          <InformationCircleIcon className="h-6 w-6 mr-1 text-gray-400" />
          Download files here!
        </span>
      </p>
      {/* Table */}
        {isLoading ? (
        <p className="text-center">Loading forms...</p>
        ) : (
        forms.map((form) => (
            <div key={form.id} className="mb-8">
            <h6 className="text-xl font-medium text-sm inline-flex items-center bg-indigo-500 text-white px-3 py-1 rounded-lg">{form.title}</h6>
            {form.files.length > 0 ? (
                <table className="w-full mt-4 divide-y divide-gray-200 bg-white text-sm p-6 mx-auto rounded-lg overflow-hidden">
                <thead>
                    <tr>
                    <th className="py-2 px-4">File Name</th>
                    <th className="py-2 px-4">Description</th>
                    <th className="py-2 px-4"></th>
                    </tr>
                </thead>
                <tbody>
                    {form.files.map((file) => (
                    <tr key={file.id} className="py-5 border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-2 border-r border-gray-200">
                        {file.file_title}
                        </td>
                        <td className="px-4 py-2 border-r border-gray-200">
                        {file.file_description}
                        </td>
                        <td className="px-4 py-2 border-r border-gray-200 flex justify-center">
                        <a
                            href={`http://localhost:8000/${file.file}`}
                            download
                            className="text-indigo-600 hover:text-indigo-500 flex items-center"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
                        </a>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <p>No files available for this form.</p>
            )}
            </div>
        ))
        )}
    </PageComponent>
  </div>
);
}
