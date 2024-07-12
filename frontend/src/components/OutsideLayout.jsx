import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function OutsideLayout() {
    const {userToken} = useStateContext();

    if(userToken) {
        return <Navigate to='/' /> 
    }

    return (
          <Outlet  />
    )
}