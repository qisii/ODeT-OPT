import React from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import TButton from "./core/TButton";

export default function RoleListItem({ role, onEditClick }) {
  const handleDeleteClick = () => {
    onDeleteClick(role.id);
  };

  const handleEditClick = () => {
    onEditClick(role.id);
  };

  const formattedDate = role.created_at
    ? new Date(role.created_at).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <tr key={role.id} onClick={handleEditClick} className="py-5 border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 border-r border-gray-200 ">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {role.name}
        </p>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </td>
      <td className="flex items-center justify-center space-x-2 px-4 py-2">
        {role.id && (
          <TButton onClick={handleEditClick} circle link color="yellow">
            <EyeIcon className="h-5 w-5 text-yellow-500" />
          </TButton>
        )}
      </td>
    </tr>
  );
}
