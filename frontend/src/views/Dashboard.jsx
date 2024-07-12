import { useEffect, useState } from "react";
import { CheckCircleIcon, MinusCircleIcon, PaperClipIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import axiosClient from "../axios";
import swal from 'sweetalert';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const role = localStorage.getItem('auth_role');
    const username = localStorage.getItem('auth_name');
    const [data, setData] = useState({
        FacultyAdminStaff: {
            total: 0,
            pending: 0,
            approved: 0,
        },
        StudentInternational: {
            total: 0,
            pending: 0,
            approved: 0,
        },
        InternalOfficeProcess: {
            total: 0,
            pending: 0,
            approved: 0,
        },
        ProjectOfficeManagement: {
            total: 0,
            pending: 0,
            approved: 0,
        },
        Total: 0,
        Users: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        dashboard();
    }, []);

    const dashboard = () => {
        // Fetch data from an API
        axiosClient
        .get(`/${role}/dashboard`)
            .then(response => {
                setData(response.data.data);
            })
            .catch(error => {
                swal("Error", error.response.data.message, "error")
                navigate(`/${role}/dashboard`);
            });
    };

    const getUsernameStyle = () => {
        if (role === "admin") {
          return "text-yellow-500";
        } else if (role === "user") {
          return "text-indigo-500";
        } else {
          return "text-gray-500";
        }
      };

return (
    <PageComponent title="Dashboard">
        <div className ="flex items-center h-10 intro-y">
        <h2 className="mr-5 text-lg font-medium truncate">Welcome, <span className={getUsernameStyle()}>{username}</span></h2>
        </div>
        {role === "admin" || role === "user" ? (
            <>
            <div className="grid grid-cols-2 gap-6 mt-5">
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <PaperClipIcon className="h-7 w-7 text-blue-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.Total}</div>
                        <div className="mt-1 text-base text-gray-600">Log Requests</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
                        <UserGroupIcon className="h-7 w-7 text-red-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.Users}</div>
                        <div className="mt-1 text-base text-gray-600">Users</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                {/* Add similar code blocks for other items */}
            </div>

            <div className="flex items-center h-10 intro-y mt-6">
                <h2 className="mr-5 text-lg font-medium truncate"> 
                <span className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-sm ml-2">
                    Faculty, Admin & Staff Mobility
                </span>
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-5">
            <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <PaperClipIcon className="h-7 w-7 text-blue-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.FacultyAdminStaff.total}</div>
                        <div className="mt-1 text-base text-gray-600">Total</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                        <MinusCircleIcon className="h-7 w-7 text-yellow-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.FacultyAdminStaff.pending}</div>
                        <div className="mt-1 text-base text-gray-600">Pending</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <CheckCircleIcon className="h-7 w-7 text-green-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.FacultyAdminStaff.approved}</div>
                        <div className="mt-1 text-base text-gray-600">Approved</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                {/* Add similar code blocks for other items */}
            </div>

            <div className="flex items-center h-10 intro-y mt-6">
                <h2 className="mr-5 text-lg font-medium truncate">
                <span className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-sm ml-2">
                    Student & International Students Mobility
                </span>
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-5">
            <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <PaperClipIcon className="h-7 w-7 text-blue-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.StudentInternational.total}</div>
                        <div className="mt-1 text-base text-gray-600">Total</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                        <MinusCircleIcon className="h-7 w-7 text-yellow-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.StudentInternational.pending}</div>
                        <div className="mt-1 text-base text-gray-600">Pending</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <CheckCircleIcon className="h-7 w-7 text-green-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.StudentInternational.approved}</div>
                        <div className="mt-1 text-base text-gray-600">Approved</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                {/* Add similar code blocks for other items */}
            </div>

            <div className="flex items-center h-10 intro-y mt-6">
                <h2 className="mr-5 text-lg font-medium truncate"> 
                <span className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-sm ml-2">
                    Internal Office Process
                </span>
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-5">
            <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <PaperClipIcon className="h-7 w-7 text-blue-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.InternalOfficeProcess.total}</div>
                        <div className="mt-1 text-base text-gray-600">Total</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                        <MinusCircleIcon className="h-7 w-7 text-yellow-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.InternalOfficeProcess.pending}</div>
                        <div className="mt-1 text-base text-gray-600">Pending</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <CheckCircleIcon className="h-7 w-7 text-green-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.InternalOfficeProcess.approved}</div>
                        <div className="mt-1 text-base text-gray-600">Approved</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                {/* Add similar code blocks for other items */}
            </div>

            <div className="flex items-center h-10 intro-y mt-6">
                <h2 className="mr-5 text-lg font-medium truncate"> 
                <span className="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-sm ml-2">
                    Project Request Office Management
                </span>
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-5">
            <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
                        <PaperClipIcon className="h-7 w-7 text-blue-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.ProjectOfficeManagement.total}</div>
                        <div className="mt-1 text-base text-gray-600">Total</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-yellow-600 bg-yellow-100 rounded-full mr-6">
                        <MinusCircleIcon className="h-7 w-7 text-yellow-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.ProjectOfficeManagement.pending}</div>
                        <div className="mt-1 text-base text-gray-600">Pending</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                <a href="#" className="transform shadow-xl rounded-lg col-span-1 intro-y bg-white">
                <div className="p-5">
                    <div className="flex justify-between">
                    <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
                        <CheckCircleIcon className="h-7 w-7 text-green-400" />
                    </div>
                    <div className="ml-2 w-full flex-1">
                        <div>
                        <div className="mt-3 text-3xl font-bold leading-8">{data.ProjectOfficeManagement.approved}</div>
                        <div className="mt-1 text-base text-gray-600">Approved</div>
                        </div>
                    </div>
                    </div>
                </div>
                </a>
                {/* Add similar code blocks for other items */}
            </div>

            </>
            ) : (
                <div className="flex items-center justify-center w-full h-48 bg-white rounded-lg shadow-lg">
                    <h3 className="text-2xl text-gray-500">Welcome</h3>
                </div>
            )}
        </PageComponent>
    );
}
