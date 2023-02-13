import axios from "axios";
import React, { useState, useEffect } from "react";
// import ExpandMore from "@mui/icons-material/ExpandMore";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@mui/material";




const Review = (props) => {

    const theme = createTheme({
        palette: {
          primary: {
            main: "#82DEE4",
          },
          secondary: {
            main: "#82DEE4",
          },
        },
    });

    const notify = () => toast("Your rating was succesfully saved.")

    useEffect(()=> {
       
    
        },[])

    // const [value,setValue] = useState([1,2,3,4,5,6,7,8,9,10]);

    const [review, setReview] = useState([]);

    const handleChange = (e) => {
        setReview(e.target.value);
    };

    const saveReview = async (e) => {
        e.preventDefault();
        const user_id = localStorage.getItem("id");
        const restaurant_id = JSON.parse(JSON.stringify(props.id));
        const restaurant_name = JSON.parse(JSON.stringify(props.restname));
        const note = localStorage.getItem("value");
        const assets = { user_id, restaurant_id, restaurant_name, note };

    try{
        await axios.post('http://localhost:3002/restaurant/note', assets);
        // alert("Your notation was succesfully added.");
        } catch (err) {
        }
    };

    useEffect(() => {
        localStorage.setItem("value", JSON.stringify(review));
    }, [review]);

    const valueSelected = (e) =>{
        document.getElementById("btn-save-review").style.display = "block";
        document.getElementById("btn-cancel").style.display = "block";
    }

    const cancelReview = (e) => {
        document.getElementById("btn-save-review").style.display = "none";
        document.getElementById("btn-cancel").style.display = "none";
    }

    return(
        <div className="Review"
            style={{
                width:"8rem",
                marginLeft:"3rem"
            }}
        >
            <ThemeProvider theme={theme}>
                <FormControl fullWidth 
                    >
                        
                    <InputLabel 
                        id="select-label"
                        style={{backgroundColor:"82DEE4",}}
                    >
                        Review
                    </InputLabel>
                    <Select
                        labelId="reviewId"
                        id="ReviewID"
                        value={review}
                        label="REVIEW"
                        onChange={handleChange}
                        onClick={valueSelected}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                    </Select>

                    <form 
                        onSubmit={saveReview}
                        onClick={notify}
                    >
                    <nav style={{display:"inline-flex"}}>
                        <Button id ="btn-save-review" 
                            type ="submit"
                            variant="contained" 
                            color="primary"
                        >
                            Submit
                        </Button>
                        <ToastContainer />

                        {/* <button id ="btn-cancel" 
                            type ="submit"
                            style={{display: "none"}} 
                            onClick={cancelReview}   
                        >
                            <CancelIcon />
                        </button> */}
                    </nav>
                    </form>
                </FormControl>
            </ThemeProvider>
        </div>
    )

};

export default Review;