import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Forms from "./views/Forms";
import Login from "./views/Login";
import OutsideLayout from "./components/OutsideLayout";
import AdminLayout from "./components/AdminLayout";
import StaffLayout from "./components/StaffLayout";
import FormView from "./views/FormView";
import ProfileView from "./views/ProfileView";
import Users from "./views/Users";
import Offices from "./views/Offices";
import Notifications from "./views/Notifications";
import RolesPermission from "./views/RolesPermission";
import UserUpdate from "./views/UserUpdate";
import FacultyAdminStaffMobility from "./views/FacultyAdminStaffMobility";
import FacultyAdminStaffMobilityView from "./views/FacultyAdminStaffMobilityView";
import StudentInternationalMobility from "./views/StudentInternationalMobility";
import StudentInternationalMobilityView from "./views/StudentInternationalMobilityView";
import Category from "./views/Category";
import InternalOfficeProcessMobility from "./views/InternalOfficeProcessMobility";
import InternalOfficeProcessMobilityView from "./views/InternalOfficeProcessMobilityView";
import ProjectOfficeManagementMobility from "./views/ProjectOfficeManagementMobility";
import ProjectOfficeManagementMobilityView from "./views/ProjectOfficeManagementMobilityView";
import DownloadForms from "./views/DownloadForms";

const routes = [
  {
    // Routes for Admin Layout
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: '/admin',
        element: <Navigate to="/admin/dashboard" replace />,
        canActivate: () => {
          const role = localStorage.getItem('auth_role');
          return role === 'admin';
        },
      },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/users", element: <Users /> },
      { path: "/users/:id", element: <Users /> },
      { path: "/users/add-admin", element: <Users /> },
      { path: "/users/view/:id", element: <UserUpdate /> },
      { path: "/users/update/:id", element: <UserUpdate /> },
      { path: "/profile/:id", element: <ProfileView /> },
      { path: "/update/:id", element: <ProfileView /> },
      { path: "/roles", element: <UserUpdate /> },

      { path: "/roles-permissions", element: <RolesPermission /> },

      { path: "/category-auth", element: <Category /> },
      { path: "/categories", element: <Category /> },
      { path: "/categories/:id", element: <Category /> },
      { path: "/categories/:id/users/:id", element: <Category /> },

      { path: "/faculty-admin-staff-mobility", element: <FacultyAdminStaffMobility /> },
      { path: "/office", element: <FacultyAdminStaffMobility /> },
      { path: "/faculty-admin-staff-mobility/add-log-request", element: <FacultyAdminStaffMobility /> },
      { path: "/faculty-admin-staff-mobility/add-file", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/view/:id", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/view/:id/files", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/view/:id/history", element: <FacultyAdminStaffMobilityView /> },
      { path: "/category-auth", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/update/:id", element: <FacultyAdminStaffMobilityView /> },

      { path: "/student-international-mobility", element: <StudentInternationalMobility /> },
      { path: "/student-international-mobility/view/:id", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/add-file", element: <StudentInternationalMobilityView /> },
      { path: "/category-auth", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/view/:id/files", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/view/:id/history", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/update/:id", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/add-log-request", element: <StudentInternationalMobility /> },

      { path: "/internal-office-process-mobility", element: <InternalOfficeProcessMobility /> },
      { path: "/internal-office-process-mobility/view/:id", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/add-file", element: <InternalOfficeProcessMobilityView /> },
      { path: "/category-auth", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/view/:id/files", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/view/:id/history", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/update/:id", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/add-log-request", element: <InternalOfficeProcessMobility /> },

      { path: "/project-office-management-mobility", element: <ProjectOfficeManagementMobility /> },
      { path: "/project-office-management-mobility/view/:id", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/add-file", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/category-auth", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/view/:id/files", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/view/:id/history", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/update/:id", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/add-log-request", element: <ProjectOfficeManagementMobility /> },
      
      { path: "/offices", element: <Offices /> },
      { path: "/offices/add-office", element: <Offices /> },

      { path: "/forms", element: <Forms /> },
      { path: "/forms/add-form", element: <Forms /> },
      { path: "/forms/view/:id", element: <FormView /> },
      { path: "/forms/add-file", element: <FormView /> },
      { path: "/forms/update-form/:id", element: <FormView /> },
      { path: "/forms/view/:id/files", element: <FormView /> },

      { path: "/notifications", element: <Notifications /> },
      { path: "/notifications", element: <AdminLayout /> },

    ].map((childRoute) => ({
      ...childRoute,
      path: `/admin${childRoute.path}`,
    })),
  },
  {
    // Routes for Staff Layout
    path: "/",
    element: <StaffLayout />,
    children: [
      {
        path: '/user',
        element: <Navigate to="/user/dashboard" replace />,
        canActivate: () => {
          const role = localStorage.getItem('auth_role');
          return role === 'user';
        },
      },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/profile/:id", element: <ProfileView /> },
      { path: "/update/:id", element: <ProfileView /> },
      { path: "/:id/status", element: <StaffLayout /> },

      { path: "/category-auth", element: <Category /> },
      { path: "/categories", element: <Category /> },
      { path: "/categories/:id", element: <Category /> },

      { path: "/faculty-admin-staff-mobility", element: <FacultyAdminStaffMobility /> },
      { path: "/office", element: <FacultyAdminStaffMobility /> },
      { path: "/faculty-admin-staff-mobility/add-log-request", element: <FacultyAdminStaffMobility /> },
      { path: "/faculty-admin-staff-mobility/add-file", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/view/:id", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/view/:id/files", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/view/:id/history", element: <FacultyAdminStaffMobilityView /> },
      { path: "/category-auth", element: <FacultyAdminStaffMobilityView /> },
      { path: "/faculty-admin-staff-mobility/update/:id", element: <FacultyAdminStaffMobilityView /> },

      { path: "/student-international-mobility", element: <StudentInternationalMobility /> },
      { path: "/student-international-mobility/view/:id", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/add-file", element: <StudentInternationalMobilityView /> },
      { path: "/category-auth", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/view/:id/files", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/view/:id/history", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/update/:id", element: <StudentInternationalMobilityView /> },
      { path: "/student-international-mobility/add-log-request", element: <StudentInternationalMobility /> },

      { path: "/internal-office-process-mobility", element: <InternalOfficeProcessMobility /> },
      { path: "/internal-office-process-mobility/view/:id", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/add-file", element: <InternalOfficeProcessMobilityView /> },
      { path: "/category-auth", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/view/:id/files", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/view/:id/history", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/update/:id", element: <InternalOfficeProcessMobilityView /> },
      { path: "/internal-office-process-mobility/add-log-request", element: <InternalOfficeProcessMobility /> },

      { path: "/project-office-management-mobility", element: <ProjectOfficeManagementMobility /> },
      { path: "/project-office-management-mobility/view/:id", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/add-file", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/category-auth", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/view/:id/files", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/view/:id/history", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/update/:id", element: <ProjectOfficeManagementMobilityView /> },
      { path: "/project-office-management-mobility/add-log-request", element: <ProjectOfficeManagementMobility /> },
      
      { path: "/offices", element: <Offices /> },
      { path: "/offices/add-office", element: <Offices /> },

      { path: "/forms", element: <Forms /> },
      { path: "/forms/add-form", element: <Forms /> },
      { path: "/forms/view/:id", element: <FormView /> },
      { path: "/forms/add-file", element: <FormView /> },
      { path: "/forms/update-form/:id", element: <FormView /> },
      { path: "/forms/view/:id/files", element: <FormView /> },

      { path: "/notifications", element: <Notifications /> },
      { path: "/notifications", element: <StaffLayout /> },

    ].map((childRoute) => ({
      ...childRoute,
      path: `/user${childRoute.path}`,
    })),
  },
  {
    path: "/",
    element: <OutsideLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
        canActivate: () => {
          const role = localStorage.getItem('auth_role');
          return role !== null;
        },
      },
      { path: "/login", element: <Login /> },
      // { path: "/signup", element: <Signup /> },
      { path: "/download-forms", element: <DownloadForms /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
