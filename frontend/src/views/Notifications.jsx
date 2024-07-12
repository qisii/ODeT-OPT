import { BellAlertIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useEffect, useState } from "react";
import axiosClient from "../axios";

export default function Notifications() {
  const role = localStorage.getItem("auth_role");
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const fetchNotifications = (page) => {
    setIsLoading(true);
    axiosClient
      .get(`/${role}/notifications?page=${page}`)
      .then((response) => {
        setNotifications(response.data.notifications.data);
        setTotalPages(response.data.notifications.last_page);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setIsLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          read_at: new Date().toISOString(), // Set the read_at timestamp
        };
      }
      return notification;
    });

    setNotifications(updatedNotifications);

    axiosClient
      .put(`/${role}/notifications/${notificationId}`)
      .then((response) => {
        // Notification marked as read successfully
      })
      .catch((error) => {
        console.error("Error marking notification as read:", error);
      });
  };

  useEffect(() => {
    axiosClient
      .get(`/${role}/notifications`) // Update the API endpoint according to your setup
      .then((response) => {
        setNotifications(response.data.notifications.data);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  }, []);

  return (
    <PageComponent title="Notifications">
      <div className="mb-4">
        <ul role="list" className="divide-y divide-gray-100">
        {isLoading ? (
          <div>Please wait...</div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex justify-between items-center gap-x-6 py-5 mb-3 ${
                notification.read_at ? "bg-white" : "bg-green-200"
              } rounded-lg shadow`}
            >
              <div className="flex items-center gap-x-4 mx-6">
                <BellAlertIcon className="h-6 w-6 text-gray-500" />
                <div className="min-w-0 flex-auto">
                  {notification.data.firstname && notification.data.lastname && notification.data.email ? (
                    <>
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {notification.data.firstname} {notification.data.lastname}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Email: {notification.data.email}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        {notification.data.name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Category: {notification.data.category_name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Sender: {notification.data.sender_name}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Logged by/Submitted by: {notification.data.created_by_firstname} {notification.data.created_by_lastname}
                      </p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        Created at:{" "}
                        {new Date(notification.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {!notification.read_at && (
                <button
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="text-indigo-500 hover:text-indigo-700 text-sm ml-2 mx-6"
                >
                  Mark as Read
                </button>
              )}
              {notification.read_at && (
                <span className="text-xs text-gray-500 mx-6">
                  Read at:{" "}
                  {new Date(notification.read_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              )}
            </li>
          ))
        ) : (
          <div>No notifications available</div>
        )}
      </ul>
      </div>
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
    </PageComponent>
  );
}
