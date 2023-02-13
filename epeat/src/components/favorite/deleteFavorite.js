import axios from "axios";
import React, { useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DeleteFavorite = (prop) => {

    useEffect(()=> {
        console.log("id =>", prop.favID._id)    
    },[])

    
        const handleSubmit = async (e) => {
            e.preventDefault();
            const favoriteID = JSON.parse(JSON.stringify(prop.favID._id));
    
        try{
            await axios.delete(`http://localhost:3002/profile/favorite/${favoriteID}`);
            } 
            catch (err) {
            }
        };

        const refreshPage =() => {
            window.location.reload(false);
        }

        const notifyDelete = () => toast("The restaurant was unfavorited with success.")

    return(
        <div className="deleteFavorite">
            <form onSubmit={handleSubmit}>
                <button 
                    style=
                    {{  
                        padding: 0,
                        border: "none",
                        background: "none",
                        marginLeft: 30,
                    }}    
                    onClick={(e) => {refreshPage();
                                    notifyDelete();
                    }}
                >
                    < ToastContainer />
                    <CancelIcon />
                </button>
            </form>
        </div>
    )
};

export default DeleteFavorite