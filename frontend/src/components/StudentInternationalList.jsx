import React from "react";
import { CheckCircleIcon, MinusCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";

export default function StudentInternationalList({log, onEditClick}) {

const handleEditClick = () => {
    onEditClick(log.id);
};

const formattedCreatedAt = new Date(log.created_at).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const formattedDateReceivedOvcia = new Date(log.date_received_ovcia).toLocaleString(
"en-US",
{
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
});

const formattedEndDate = new Date(log.end_date).toLocaleString(
    "en-US",
    {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    let statusDisplay = "";
    let statusIcon = null;
    let statusTextColor = "";
    
    if (log.status === "pending") {
      statusDisplay = "Pending";
      statusIcon = <MinusCircleIcon className="h-5 w-5 text-yellow-500" />;
      statusTextColor = "text-yellow-500";
    } else if (log.status === "approved") {
      statusDisplay = "Approved";
      statusIcon = <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      statusTextColor = "text-green-500";
    }

// const loggedByUser = users.find(user => user.id === request.logged_by);
// const loggedByName = loggedByUser ? loggedByUser.name : "";

return (
    <tr key={log.id} onClick={handleEditClick} className="py-5 border-b border-gray-200 hover:bg-gray-50">
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm font-semibold leading-6 text-gray-900">{log.name}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm font-semibold leading-6 text-gray-900">{log.sender_name}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-500">{formattedDateReceivedOvcia}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <span className="text-sm text-gray-500">{formattedEndDate}</span>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-500">{log.dts_num}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-500">{log.office}</p>
        </td>
        <td className={`px-4 py-2 border-r border-gray-200}`}>
        <div className="flex items-center">
        <span className={`text-sm font-semibold leading-6 ${statusTextColor}`}>{statusDisplay}</span>
          {statusIcon}
        </div>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-500">{log.created_by.firstname} {log.created_by.lastname}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <span className="text-sm text-gray-500">{formattedCreatedAt}</span>
        </td>
        <td className="flex items-center justify-center space-x-2 px-4 py-2">
        <TButton onClick={handleEditClick} circle link color="blue">
            <PencilIcon className="h-5 w-5 text-blue-500" />
        </TButton>
        </td>
    </tr>
    );
}
