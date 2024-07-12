import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import TButton from "../components/core/TButton";

export default function FormFileListItem({file, onDeleteClick, onFileClick }) {

const handleDeleteClick = () => {
    onDeleteClick(file.id, file.file_title);
    };

const handleFileClick = () => {
    onFileClick(file);
    };

const formattedDate = file.created_at
? new Date(file.created_at).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    })
: "";

return (
    <tr key={file.id} className="py-5 border-b border-gray-100 hover:bg-gray-50" onClick={handleFileClick}>
        <td className="px-4 py-2 border-r border-gray-200">
        <p className="text-sm font-semibold leading-6 text-gray-900">{file.file_title}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-100">
        <p className="text-sm leading-6 text-gray-500">{file.file_description}</p>
        </td>
        <td className="px-4 py-2 border-r border-gray-100">
        <span className="text-sm text-gray-500">{formattedDate}</span>
        </td>
        <td className="flex items-center justify-center space-x-2 px-4 py-2">
        {file.id && (
            <TButton onClick={handleDeleteClick} circle link color="red">
            <TrashIcon className="h-5 w-5 text-red-500" />
            </TButton>
        )}
        </td>
    </tr>
    );
}
