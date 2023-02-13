import React,{useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom'
import Confetti from 'react-confetti'

import { Helmet } from 'react-helmet';


import "./success.css";

const Success = () => {

  const [Name , setName] = useState([])


    const navigate = useNavigate()

    useEffect(() => {
setName(localStorage.getItem("name"))
console.log(Name)
    },[])

    useEffect(() => {
        setTimeout(() => {
          navigate('/')
        }, 40000)
      }, [])
  return (
    
    <div className="card">
<Helmet>
        <title>Epeat | Payment Success</title>
      </Helmet>

      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div className="Container">
        <i className="checkmark">✓</i>
      </div>
      <h1>
        Successful
        <br /> payment
      </h1>

      <br />
      <h1>
        Thank you {Name} for ordering on Ep'eat !
        <br />
        <br />
        Your order is being prepared
      </h1>
      <br />
      You will be redirected to the home page...

    </div>
  );
};

export default Success;
