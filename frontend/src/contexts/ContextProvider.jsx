import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: {},
    userToken: null,
    forms: [],
    role:  null,
    offices: [],
    roles: {},
    setCurrentUser: () => {},
    setUserToken: () => {},
    setRole: () => {},
})


export const ContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState({});
    const [role, _setRole] = useState(localStorage.getItem('auth_role') || '');
    const [userToken, _setUserToken] = useState(localStorage.getItem('TOKEN') || '');
    const [currentUserRole, setCurrentUserRole] = useState({});
    const [forms, setForms] = useState([]);
    const [offices, setOffices] = useState([]);
    const [users, setUsers] = useState([]);
    const [picture, setPicture] = useState([]);
    const [roles, setRoles] = useState([]);

    const setUserToken = (token) => {
        if (token) {
            localStorage.setItem('TOKEN', token)
        } else {
            localStorage.removeItem('TOKEN')
        }
        _setUserToken(token);
    }

    const setRole = (role) => {
        if (role) {
            localStorage.setItem('auth_role', role)
        } else {
            localStorage.removeItem('auth_role')
        }
        _setRole(role);
    }
    
    return (
        <StateContext.Provider value={{ 
            currentUser,
            setCurrentUser,
            userToken,
            setUserToken,
            role,
            setRole,
            forms,
            offices,
            setOffices,
            roles,
            setRoles,
            users,
            setUsers,
            picture,
            setPicture
         }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)