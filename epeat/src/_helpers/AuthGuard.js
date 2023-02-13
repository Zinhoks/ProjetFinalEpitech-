import { accountService } from "../_service/account_service";
import { Navigate } from "react-router-dom";



const AuthGuard = ({ children }) => {

  if (!accountService.isLogged()) {
      return <Navigate to="/Auth"/>
      }

  return children
};

export default AuthGuard;


