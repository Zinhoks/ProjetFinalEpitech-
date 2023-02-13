import React, { useState } from "react";
import { accountService } from "../../_service/account_service";
import info from "../../_helpers/Statut";
import { useNavigate } from 'react-router-dom';


import "./FormLogin.css";
import Navbar from "../Navbar/Navbar";

import { Helmet } from 'react-helmet';


const FormLogin = () => {
  let navigate = useNavigate()
  const [credentials, setCredentials] = useState([]);
  const [user, setUser] = useState([]);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageRegister, setErrorMessageRegister] = useState("");




  const onChange = (e) => {
    console.log(e.target.value);
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeregister = (e) => {
    console.log(e.target.value);
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    accountService
      .login(credentials)

      .then((res) => {
        accountService.saveToken(res.data.user._id);
        info.statut = res.data.user.status;
        info.name = res.data.user.username;
        localStorage.setItem("name", info.name);
        console.log(info.statut);
        localStorage.setItem("statut", info.statut);
        navigate('/')

      })
      .catch((error) => { 
        setErrorMessage("Incorrect email or password");

        console.log(error) });
  };

  const onSubmitregister = (e) => {
    e.preventDefault();
    
    console.log(user);
    accountService
    .register(user)
    .then((res) => {
        console.log(res);
        setSuccessMessage(
          "successful registration, Now you can log in using the form on the left ! ");
    })
    .catch((err) => {
      setErrorMessageRegister("An error occurred while registering, refresh the page and try again");
      console.log(err) });
    
  };

  return (
    <div className="Loginbod">
      <Helmet>
        <title>Epeat | Authentication</title>
      </Helmet>
      <Navbar />
      <div className="containerLogin">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={onSubmit}>
            <div className="user-box">
              <input
                type="email"
                name="email"
                required="required"

                value={credentials.email}
                onChange={onChange}
              ></input>
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                name="password"
                required="required"

                value={credentials.password}
                onChange={onChange}
              ></input>
              <label>Password</label>
            </div>
            {errorMessage && (
              <div style={{ color:'red', backgroundColor:'white', borderRadius:5, width:'200px',fontFamily: "Bukhari Script"}} className="error-message">{errorMessage}</div>
            )}
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <button type="submitlogin">Submit</button>
          </form>
        </div>
        <div className="register-box">
          <h2>Register</h2>
          <form onSubmit={onSubmitregister}>
            <div className="user-box">
              <input
                type="name"
                name="username"
                required="required"
                value={user.username}
                onChange={onChangeregister}
              ></input>
              <label>Username</label>
            </div>
            <div className="user-box">
              <input
                type="email"
                name="email"
                required="required"
                value={user.email}
                onChange={onChangeregister}
              ></input>
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                type="adresse"
                name="address"
                required="required"
                value={user.address}
                onChange={onChangeregister}
              ></input>
              <label>Adress</label>
            </div>
            <div className="user-box">
              <input
                type="Password"
                name="password"
                required="required"
                value={user.password}
                onChange={onChangeregister}
              ></input>
              <input
                name="status"
                type="hidden"
                placeholder="status"
                value={(user.status = "user")}
              >
               
              </input>
              <label>Password</label>
            </div>
            {successMessage && (
              <div style={{ color:'green', backgroundColor:'white', backgroundColor:'white', borderRadius:5, fontFamily: "Bukhari Script"}} className="success-message">{successMessage}</div>
            )}
            {errorMessageRegister && (
              <div style={{ color:'red', backgroundColor:'white', backgroundColor:'white', borderRadius:5, fontFamily: "Bukhari Script"}} className="error-message">{errorMessage}</div>
            )}
            <button type="submit" >Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;
