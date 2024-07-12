import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import TButton from "../components/core/TButton";

export default function FormListItem({form, onDeleteClick, onEditClick}) {

const handleDeleteClick = () => {
    onDeleteClick(form.id, form.title);
    };

const handleEditClick = () => {
    onEditClick(form.id);
};

const formattedDate = form.created_at
? new Date(form.created_at).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    })
: "";

return (
    <tr key={form.id} className="py-5 border-b border-gray-200 hover:bg-gray-50">
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm font-semibold leading-6 text-gray-900">{form.title}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm leading-6 text-gray-500">{form.description}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-200">
        <span className="text-sm text-gray-500">{formattedDate}</span>
        </td>
        <td className="flex items-center justify-center space-x-2 px-4 py-2">
        <TButton onClick={handleEditClick} circle link color="blue">
            <PencilIcon className="h-5 w-5 text-blue-500" />
        </TButton>
        {form.id && (
            <TButton onClick={handleDeleteClick} circle link color="red">
            <TrashIcon className="h-5 w-5 text-red-500" />
            </TButton>
        )}
        </td>
    </tr>
    );
}
