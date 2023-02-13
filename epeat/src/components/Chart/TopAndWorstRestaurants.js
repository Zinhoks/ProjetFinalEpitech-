import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useState, useEffect } from "react";

const TopAndWorstRestaurants = () => {
  const [notesInfo, setNotesinfo] = useState([]);
  const [average, setAverage] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dataGraph, setDataGraph] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch("http://localhost:3002/restaurant/note")
        .then((response) => response.json())
        .then((data) =>
          setNotesinfo(
            data.map((item) => {
              return { note: item.note, restoName: item.restaurant_name };
            })
          )
        );
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = {};
    notesInfo.forEach((obj) => {
      let restoName = obj.restoName;
      let note = obj.note;
      if (result[restoName]) {
        result[restoName].notes.push(note);
        result[restoName].sum += note;
        result[restoName].count += 1;
      } else {
        result[restoName] = { notes: [note], sum: note, count: 1 };
      }
    });

    let avgArray = [];
    for (let restoName in result) {
      result[restoName].average =
        result[restoName].sum / result[restoName].count;
      avgArray.push({ name: restoName, avgNote: result[restoName].average });
    }
    setAverage(avgArray);
  }, [notesInfo]);

  useEffect(() => {
    const sortedArray = average.sort((a, b) => b.avgNote - a.avgNote);
    const TOP3 = sortedArray.slice(0, 3);
    const LOW3 = sortedArray.slice(-3).reverse();
    const finalArray = TOP3.concat(LOW3);
    setLabels(finalArray.map((item) => item.name));
    setDataGraph(finalArray.map((item) => item.avgNote));
  }, [average]);

  return (
    <div
      style={{
        width: "30%",
        // display: "flex",
        // flexDirection: "column",
        // textAlign: "center",
      }}
      className="top-restaurant"
    >
      <h1 className="top-h1"> Top 3 & Flop 3</h1>
      <div
        className="top-restaurant-graphs"
        style={{
          width: "100%",
          height: "80%",
          textAlign: "center",
        }}
      >
        <PolarArea
          data={{
            labels: labels,
            datasets: [
              {
                data: dataGraph,
                backgroundColor: [
                  "rgb(75, 192, 192)", // green
                  "rgb(201, 203, 207)", // grey
                  "rgb(54, 162, 235)", // blue
                  "rgb(255, 205, 86)", // yellow
                  "rgb(255, 148, 112)", // orange
                  "rgb(255, 99, 132)", // pink
                ],
                type: "polarArea",
                // options: {
                //   options: { responsive: true, maintainAspectRatio: true },
                //   plugins: {
                //     legend: { display: true },
                //   },
                // },
              },
            ],
          }}
        />
      </div>
    </div>
  );
};
export default TopAndWorstRestaurants;
