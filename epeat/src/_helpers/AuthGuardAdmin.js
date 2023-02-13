import { accountService } from "../_service/account_service";
import { Navigate } from "react-router-dom";

const AuthGuardAdmin = ({ children }) => {

    if (!accountService.isLogged()) {
        return <Navigate to="/Auth"/>
        }
  
  
    if (!accountService.isAdmin()){
       return <Navigate to ="/"/>
    }
    return children
  };
  
  export default AuthGuardAdmin;