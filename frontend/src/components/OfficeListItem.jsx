import React from "react";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import TButton from "./core/TButton";

export default function OfficeListItem({ office, onDeleteClick }) {
  const handleDeleteClick = () => {
    onDeleteClick(office.id);
  };

  const formattedDate = office.created_at
    ? new Date(office.created_at).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <tr key={office.id} className="py-5 border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 border-r border-gray-200 ">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {office.name}
        </p>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </td>
      <td className="flex items-center justify-center space-x-2 px-4 py-2">
        {office.id && (
          <TButton onClick={handleDeleteClick} circle link color="red">
            <TrashIcon className="h-5 w-5 text-red-500" />
          </TButton>
        )}
      </td>
    </tr>
  );
}
