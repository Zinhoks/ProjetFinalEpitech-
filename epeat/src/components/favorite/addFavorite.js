import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useFavoriteContext } from "../components/favorite/favoriteList";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useCallback } from "https://cdn.skypack.dev/react@17";
import confetti from "https://cdn.skypack.dev/canvas-confetti@1";

const AddFavorite = (props) => {
  useEffect(() => {
   
  }, []);
  // const [favoriteRestaurant, addFavorite, removeFavorite] = useFavoriteContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID = localStorage.getItem("id");
    const Restaurant_ID = JSON.parse(JSON.stringify(props.id));
    const Restaurant_Name = JSON.parse(JSON.stringify(props.restname));
    const elements = { userID, Restaurant_ID, Restaurant_Name };

    try {
      await axios.post("http://localhost:3002/profile/favorite", elements);
      // alert("Added to your favorite");
    } catch (err) {
      // alert("Failed.");
    }
  };

  const notify = () => {
  toast("Added to your favorite.")
  
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { x: 0.71, y: 0.7  },
    });
  }
  return (
    <div className="AddFavorite">
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          onClick={notify}
          style={{
            backgroundColor: "#82DEE4",
            width: "9rem",
            borderRadius: "12px",
            height: "3.5rem",
            border:'none'
            
          }}
        >Add Favorite
        </button>
        
      </form>
    </div>
  );
};

export default AddFavorite;
