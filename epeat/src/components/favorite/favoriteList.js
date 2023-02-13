import axios from "axios";
import React, { useState, useEffect } from "react";
import DeleteFavorite from "./deleteFavorite";
// import { createContext } from "react";

const FavoriteList = (props) => {
    const [favorite, setFavorite] = useState([]);

    useEffect(() => {
        async function getFavoriteList() {
            try{
                const res = await axios.get("http://localhost:3002/profile/favorite"
            );
            setFavorite(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        getFavoriteList();
    }, [])

    return(
        <div className={favorite.Restaurant_Name}>
            {favorite
            .filter((favorite) => favorite.userID === props.result)
            .map((fav) => (
          <div key={fav.id}>
            <nav>

                <ul  style={{display:"inline-flex"}}>
                    <li>
                        {fav.Restaurant_Name}
                    </li>
                    <DeleteFavorite favID={fav}/> {""}
                </ul>
            </nav>
          </div>
        ))}
    </div>
    );
};

export default FavoriteList;