import React, { useEffect, useState } from "react";

import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

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

const TopUsersOrder = () => {
  const [Labels, setLabels] = useState([]);
  const [dataa, setDataa] = useState([]);
  const [Usersinfo, setUsersinfo] = useState([]);
  const [orders, setOrders] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("http://localhost:3002/admin/users")
        .then((response) => response.json())
        .then((data) =>
          setUsersinfo(
            data.map((item) => {
              return { name: item.username, id: item._id };
            })
          )
        );
    };

    const fetchOrders = async () => {
      await fetch("http://localhost:3002/orders")
        .then((response) => response.json())
        .then((data) => {
          let count = {};
          data.forEach((item) => {
            if (item.hasOwnProperty("idUser")) {
              if (count[item.idUser]) {
                count[item.idUser]++;
              } else {
                count[item.idUser] = 1;
              }
            }
          });
          setOrders(count);
        });
    };
    fetchData();
    fetchOrders();
  }, []);

  // useEffect(() => {
  //   setLabels(Usersinfo.map(item => item.name));
  //   setDataa(Usersinfo.map(({ id }) => orders[id] || 0));
  // }, [Usersinfo, orders]);

  useEffect(() => {
    const TopThreeUsers = Object.entries(orders)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    setLabels(
      TopThreeUsers.map((item) => {
        const user = Usersinfo.find((user) => user.id === item[0]);
        return user ? user.name : "Not found username";
      })
    );
    setDataa(TopThreeUsers.map((item) => item[1]));

    console.log(dataa)
  }, [orders, Usersinfo]);

  return (
    <div 
      style={{ width: "30%"}}
      className="top-users"
    >
      <h1 className="top-h1"> Top 3 des utilisateurs ayant le plus commandé.</h1>
      <div className="graphs">
        <Bar
        style={{size: '200%',}}
          data={{
            labels: Labels,
            datasets: [
              {
                label: "Top 1",
                data: dataa,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                  ],
                type: "doughnut",
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default TopUsersOrder;
