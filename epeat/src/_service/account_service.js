import Axios from "./caller_service";

let login = (credentials) => {
  return Axios.post("/users/signin", credentials);
};
let register = (user) => {
    return Axios.post("/users/signup", user);
  };

let saveToken = (_id) => {
  localStorage.setItem("id", _id);
};
let getToken = () => {
    return localStorage.getItem("id");
  };
  let logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("name")
    localStorage.removeItem("statut");
  };

let isLogged = () => {
  let token = localStorage.getItem("id");

  return !!token;
};

let isAdmin = () => {
  let statut = localStorage.getItem("statut");

  if (statut !== "user"){
    return true;
  }
}


export const accountService = {
  saveToken,
  logout,
  isLogged,
  login,
  getToken,
 register,
 isAdmin
};