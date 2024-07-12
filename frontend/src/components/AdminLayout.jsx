import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, ChevronDownIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink, Navigate, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useStateContext  } from '../contexts/ContextProvider';
import axiosClient from '../axios.js';
import swal from 'sweetalert';

const navigation = [
  { name: 'Dashboard', to: '/admin/dashboard' },
  { name: 'Users', to: '/admin/users' },
  // { name: 'Roles & Permissions', to: '/admin/roles-permissions' },
  { name: 'Password Management', to: '/admin/categories' },
  {
    name: 'Categories',
    items: [
      // { name: 'Categories', to: '/admin/categories'},
      { name: 'Faculty, Admin & Staff', to: '/admin/faculty-admin-staff-mobility' },
      { name: 'Students & International Students', to: '/admin/student-international-mobility' },
      { name: 'Internal Office Process', to: '/admin/internal-office-process-mobility' },
      { name: 'Project Request Office Management', to: '/admin/project-office-management-mobility' },
    ],
  },
  { name: 'Forms', to: '/admin/forms' },
  { name: 'Offices', to: '/admin/offices' },
  { name: 'Notifications', to: '/admin/notifications' },
  // { name: 'History', to: '/admin/history' },
];

const userNavigation = [
  { name: 'Your Profile', to: '/admin/profile' },
  { name: 'Logout', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
  const [activeRequest, setActiveRequest] = useState(null);
  const { currentUser, userToken, setCurrentUser, setUserToken } = useStateContext();
  const [currentUserId, setCurrentUserId] = useState(null); // Add this line
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Add this.
  const role = localStorage.getItem('auth_role');
  const userId = localStorage.getItem('auth_userId');
  const [totalNotifications, setTotalNotifications] = useState(0); // Add this line
  const [notifications, setNotifications] = useState([]);
  const [isTokenExpired, setTokenExpired] = useState(false); // Add state to track token expiration
  const [shouldRedirect, setShouldRedirect] = useState(false); // Add shouldRedirect state
  const [userStatus, setUserStatus] = useState(null);

  if (!userToken || !role) {
    navigate('/login');
    return;
  }

  if (userStatus === 'Disabled') {
    setUserToken(null);
        // Clear all items from localStorage and redirect to the login page
    localStorage.clear();
    swal('Account Disabled', 'Your account is disabled. Please contact an administrator.', 'error').then(() => {
      navigate('/login');
    });
  }

  const checkUserStatus = () => {
    axiosClient
      .get(`/${role}/${userId}/status`) // Replace this with the actual endpoint to fetch the user's status
      .then((response) => {
        setUserStatus(response.data.status); // Set the user's status in the state
      })
      .catch((error) => {
        console.error("Error fetching user status:", error);
      });
  };

  useEffect(() => {
    checkUserStatus();
  }, [location]); 

  const checkTokenExpiration = () => {
    const expirationDate = localStorage.getItem('TOKEN_EXPIRATION');
    if (expirationDate) {
      const currentTime = new Date().getTime();
      const expirationTime = new Date(expirationDate).getTime();
      if (currentTime >= expirationTime) {
        setTokenExpired(true);
        setUserToken(null);
        // Clear all items from localStorage and redirect to the login page
        localStorage.clear();
        swal('Session Expired', '', 'info').then(() => {
          navigate('/login');
        });
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration(); // Check token expiration on initial render
  }, []);

  // Check token expiration on each navigation change
  useEffect(() => {
    checkTokenExpiration();
  }, [location]);

  const logout = (ev) => {
    ev.preventDefault();
    setActiveRequest(null); // Clear the active state
    axiosClient.post('/logout').then((res) => {
      setCurrentUser({});
      setUserToken(null);
      // Clear all items from localStorage and redirect to the login page
      localStorage.clear();
      return <Navigate to="/login" />; // Redirect to the login page
    });
  };

  const clearActiveRequest = () => {
    setActiveRequest(null);
  };

  const isCurrentLocation = (path) => {
    const location = useLocation();
    return location.pathname === path;
  };
  
  // Check the location pathname on initial render and set the active request if it matches
  useEffect(() => {
    const pathname = location.pathname;
    const requestLinks = navigation.find((item) => item.name === 'Categories');
    if (requestLinks) {
      const activeSubItem = requestLinks.items.find((subItem) => subItem.to === pathname);
      if (activeSubItem) {
        setActiveRequest(activeSubItem.name);
      }
    }
  }, [location]);
   
  useEffect(() => {
    if (role !== 'admin') {
      swal('Unauthorized Access', 'You are not authorized to view this page', 'error').then(() => {
        if (role === 'user') {
          navigate("/user/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      });
    }

    if (userStatus === 'Disabled') {
      setUserToken(null);
        // Clear all items from localStorage and redirect to the login page
      localStorage.clear();
      swal('Account Disabled', 'Your account is disabled. Please contact an administrator.', 'error').then(() => {
        navigate('/login');
      });
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate("/admin/dashboard");
    }
  }, []);
  
  const fetchNewNotifications = () => {
    axiosClient
      .get(`/${role}/notifications`)
      .then((response) => {
        setNotifications(response.data.notifications.data);
        setTotalNotifications(response.data.totalUnread);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(fetchNewNotifications, 2000); // Fetch new notifications every 10 seconds

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, []);

  // Call the fetchTotalNotifications function whenever needed
  useEffect(() => {
    fetchNewNotifications();
  }, []);

  useEffect(() => {
    // Retrieve the auth_userId from localStorage
    const authUserId = localStorage.getItem('auth_userId');
    setCurrentUserId(authUserId); // Set the currentUserId state
    
    // Fetch notifications and total count
    axiosClient
    .get(`/${role}/notifications`)
    .then((response) => {
      setNotifications(response.data.notifications.data);
      setTotalNotifications(response.data.total); // Set the total count of notifications
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 w-64 ${isMobileMenuOpen && isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-center h-14">
          <img
            className="h-8 w-8"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>
        <nav className="py-4">
          {navigation.map((item) =>
            item.items ? (
              <Disclosure key={item.name}>
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      as="div"
                      className={classNames(
                        'flex items-center justify-between px-4 py-2 text-sm font-medium rounded',
                        activeRequest ? 'bg-gray-900 text-white text-sm mx-2 pl-4' : 'text-gray-300 mx-2 pl-4 text-sm hover:bg-gray-700 hover:text-white',
                        'block px-4 py-2 text-sm font-medium rounded-md my-1'
                      )}
                    >
                      {item.name}
                      <ChevronDownIcon
                        className={classNames(
                          'flex-shrink-0 h-4 w-4',
                          open ? 'transform rotate-180' : '',
                        )}
                        aria-hidden="true"
                      />
                    </Disclosure.Button>
                    <Transition
                      show={open}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="space-y-1">
                        {item.items.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.to}
                            onClick={() => {
                              setActiveRequest(subItem.name);
                              clearActiveRequest();
                            }}
                            className={classNames(
                              subItem.name === activeRequest ? 'bg-gray-900 text-white text-sm pl-6 font-medium' : 'text-gray-300 pl-6 text-sm hover:bg-gray-700 hover:text-white',
                              'block rounded-md px-3 py-2 my-1 mx-2',
                            )}
                            activeClassName="bg-gray-900 text-white" // Add activeClassName for active state
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ) : (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    isActive ? 'bg-gray-900 text-white mx-2' : 'text-gray-300 hover:bg-gray-700 mx-2 hover:text-white',
                    'block px-4 py-2 text-sm font-medium rounded-md my-1',
                    item.name === 'Notifications' ? 'flex justify-between items-center' : ''
                  )
                }
                isActive={(match, location) => {
                  if (item.name === 'Categories') {
                    if (match) {
                      const activeSubItem = item.items.find((subItem) => subItem.to === location.pathname);
                      return activeSubItem !== undefined;
                    }
                    return false;
                  }
                  return match;
                }}
                onClick={() => {
                  setActiveRequest(item.name);
                  clearActiveRequest();
                }}
              >
                <span>
                {item.name}
                </span>
                {item.name === 'Notifications' && totalNotifications > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    {totalNotifications}
                  </span>
                )}
              </NavLink>
            ),
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <header className="flex items-center justify-between py-4 px-6 bg-white border-b-4 border-indigo-400">
          <div className="flex items-center">
            {/* Sidebar toggle button */}
            <button
              type="button"
              className="text-gray-500 focus:outline-none focus:text-gray-600 block lg:hidden"
              onClick={() => {
                setMobileMenuOpen(!isMobileMenuOpen);
                setSidebarOpen(true);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
            <button
            type="button"
            className="text-gray-500 focus:outline-none focus:text-gray-600 hidden lg:block"
            onClick={() => {
              setMobileMenuOpen(true);
              setSidebarOpen(!isSidebarOpen);
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          </div>
          <div className="flex items-center">
            {/* Profile dropdown */}
            <Menu as="div" className="ml-3 relative">
              {({ open }) => (
                <>
                  <div>
                  <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring">
                    <span className="sr-only">Open user menu</span>
                    <div className="bg-gray-100 flex items-center justify-center h-8 w-8 rounded-full">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                  </Menu.Button>
                  </div>
                  <Transition
                    show={open}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <NavLink
                            to={`/admin/profile/${currentUserId}`} // Pass the userId as a route parameter
                            onClick={(ev) => {
                              if (item.to === '/admin/profile') {
                                setActiveRequest(null);
                                navigate(`/admin/profile/${currentUserId}`); // Navigate to the profile route using navigate function
                                } else {
                                  logout(ev);
                                }
                              }}                              
                              className={classNames(
                                'block px-4 py-2 text-sm text-gray-700 ml-2 mr-2 rounded',
                                (item.to === '/admin/profile' && location.pathname === '/admin/profile') || (item.to !== '/admin/profile' && active)
                                  ? 'bg-gray-300 text-gray-900 font-medium'
                                  : '',
                              )}
                            >
                              {item.name}
                            </NavLink>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </header>

        {/* Your content */}
        <Outlet />

      </div>
    </div>
  );
}
