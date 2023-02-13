import React,{useEffect,useState} from 'react';

const Rating = () => {

    
    const [averages, setAverages] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3002/restaurant/note")
      .then((response) => response.json())
      .then((data) => {
        let restaurantAverages = [];
        data.forEach((restaurant) => {
          if (restaurantAverages[restaurant.restaurant_id]) {
            restaurantAverages[restaurant.restaurant_id].sum += restaurant.note;
            restaurantAverages[restaurant.restaurant_id].count++;
          } else {
            restaurantAverages[restaurant.restaurant_id] = {
              sum: restaurant.note,
              count: 1,
            };
          }
        });

        for (let restaurantId in restaurantAverages) {
          restaurantAverages[restaurantId] =
            restaurantAverages[restaurantId].sum /
            restaurantAverages[restaurantId].count;
        }
console.log(restaurantAverages)
        setAverages(restaurantAverages);
      })
      .catch((error) => console.error(error));
  }, []);
    return (
        <div>
            <h1> TEST RATING</h1>
        </div>
    );
};

export default Rating;

