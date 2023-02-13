import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDish = ({ onSave }) => {
  const [Dish_Name, setDish_Name] = useState("");
  const [Dish_Price, setDish_Price] = useState("");
  const [Restaurant_ID, setRestaurant_ID] = useState("");
  const [Restaurant_List, setRestaurant_List] = useState([]);

  const onSubmit = (e) => {
    e.preventDefault();
    onSave({ Dish_Name, Dish_Price, Restaurant_ID, Restaurant_List });

    setDish_Name("");
    setDish_Price("");
    setRestaurant_ID("");
    setRestaurant_List([]);
  };

  const SaveDish = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/dishes", {
        Dish_Name,
        Dish_Price,
        Restaurant_ID,
        Restaurant_List,
      });
      // console.log("NAME", Dish_Name)
    } catch (err) {
      console.log(err);
    }
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  const handleChange = (e) => {
    setRestaurant_List(e.target.value.split(","));
  };

  const notifyCreate = () => toast("The new dish was added with success.");

  return (
    <div className="AddDish">
      <form onSubmit={SaveDish}>
        <input
          type="text"
          placeholder="Nom du plat"
          value={Dish_Name}
          onChange={(e) => setDish_Name(e.target.value)}
        />

        <input
          type="text"
          placeholder="Prix"
          value={Dish_Price}
          onChange={(e) => setDish_Price(e.target.value)}
        />

        <input
          type="text"
          placeholder="ID du restaurant"
          value={Restaurant_ID}
          onChange={(e) => setRestaurant_ID(e.target.value)}
        />

        <input
          type="text"
          placeholder="Restaurants List"
          value={Restaurant_List}
          onChange={(e) => handleChange(e)}
        />

        <button
          type="submit"
          onClick={() => {
            // refreshPage();
            notifyCreate();
          }}
        >
          Ajouter un plat
        </button>
      </form>
    </div>
  );
};

export default AddDish;
