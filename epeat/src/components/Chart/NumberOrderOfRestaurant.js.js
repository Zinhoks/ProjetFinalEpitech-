import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import Divider from "@mui/material/Divider";

let data = {
  labels: [],
  datasets: [
    {
      label: "couleur",
      data: [],
      type: "bar",
    },
  ],
};

const Chartjs = () => {
  const [Labels, setLabels] = useState([]);
  const [dataa, setDataa] = useState([]);

  const [Restaurantname, setRestaurantname] = useState([]);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("http://localhost:3002/restaurants")
        .then((response) => response.json())
        .then((data) =>
          setRestaurantname(
            data.map((item) => {
              return { name: item.name, id: item._id };
            })
          )
        );
    };

    fetchData();

    const fetchorders = async () => {
      await fetch("http://localhost:3002/orders")
        .then((response) => response.json())
        .then((data) => {
          const restaurantIdCount = data.reduce((counts, order) => {
            order.dishinfo.forEach(({ Restaurant_ID }) => {
              counts[Restaurant_ID] = (counts[Restaurant_ID] || 0) + 1;
            });
            return counts;
          }, {});
          setOrders(restaurantIdCount);
          //console.log(restaurantIdCount)
        });
    };
    fetchorders();
  }, []);

  useEffect(() => {
    setLabels(Restaurantname.map((item) => item.name));

    setDataa(Restaurantname.map(({ id }) => orders[id] || 0));
  }, [Restaurantname]);

  return (
    <div 
      style={{ width: "30%" }}
      className="top-order"
    >
      <h1 className="top-h1">Nombre de commande par Restaurant</h1>

      <div className="graphs">
        <Bar
          data={{
            labels: Labels,
            datasets: [
              {
                label: "Nombre de commande",
                data: dataa,
                type: "bar",
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Chartjs;