import React from "react";
import TButton from "./core/TButton";
import { CheckCircleIcon, MinusCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function UserListItem({ user, onDeleteClick, onEditClick }) {
  const handleDeleteClick = () => {
    onDeleteClick(user.id, user.email);
  };

  const handleEditClick = () => {
    onEditClick(user.id);
  };

  let roleClassName = "";
  let roleDisplay = "";

  if (user.roleNames.includes("admin")) {
    roleClassName = "text-yellow-500";
    roleDisplay = "Admin";
  } else if (user.roleNames.includes("user")) {
    roleClassName = "text-indigo-500";
    roleDisplay = "User";
  }

  let statusDisplay = "";
    let statusIcon = null;
    let statusTextColor = "";
    
    if (user.status === "Disabled") {
      statusDisplay = "Disabled";
      statusIcon = <MinusCircleIcon className="h-5 w-5 text-red-500" />;
      statusTextColor = "text-red-500";
    } else if (user.status === "Active") {
      statusDisplay = "Active";
      statusIcon = <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      statusTextColor = "text-green-500";
    }

  return (
    <tr key={user.id} className="py-5 border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm font-semibold leading-6 text-gray-900">{user.firstname}</p>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-500">{user.lastname}</p>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-500">{user.email}</p>
      </td>
      <td className={`px-4 py-2 border-r border-gray-200`}>
        <p className={`text-sm font-semibold leading-6 ${roleClassName}`}>{roleDisplay}</p>
      </td>
      <td className={`px-4 py-2 border-r border-gray-200}`}>
        <div className="flex items-center">
        <span className={`text-sm font-semibold leading-6 ${statusTextColor}`}>{statusDisplay}</span>
          {statusIcon}
        </div>
        </td>
      <td className="flex items-center justify-center space-x-2 px-4 py-2">
        <TButton onClick={handleEditClick} circle link color="blue">
          <PencilIcon className="h-5 w-5 text-blue-500" />
        </TButton>
        {user.id && (
          <TButton onClick={handleDeleteClick} circle link color="red">
            <TrashIcon className="h-5 w-5 text-red-500" />
          </TButton>
        )}
      </td>
    </tr>
  );
}
