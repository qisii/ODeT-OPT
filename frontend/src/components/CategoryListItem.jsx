import React from "react";
import { ChevronRightIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import TButton from "./core/TButton";

export default function CategoryListItem({ category, onEditClick }) {
  const handleDeleteClick = () => {
    onDeleteClick(category.id);
  };

  const handleEditClick = () => {
    onEditClick(category.id);
  };
  const formattedUpdatedDate = category.updated_at
  ? new Date(category.updated_at).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  : "";

  return (
    <tr key={category.id} onClick={handleEditClick} className="py-5 border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 border-r border-gray-200 ">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {category.name}
        </p>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <span className="text-sm text-gray-500">{formattedUpdatedDate}</span>
      </td>
      <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-900">
        {category.updated_by && category.updated_by.firstname && category.updated_by.lastname
      ? `${category.updated_by.firstname} ${category.updated_by.lastname}`
      : 'None'}
          </p>
      </td>
      <td className="flex items-center justify-center space-x-2 px-4 py-2">
        {category.id && (
          <TButton onClick={handleEditClick} circle link color="blue">
            <PencilIcon className="h-5 w-5 text-blue-500" />
          </TButton>
        )}
      </td>
    </tr>
  );
}
