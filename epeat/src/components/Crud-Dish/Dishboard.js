import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField, Button } from "@mui/material";
import AddDish from "./addDish";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SendIcon from "@mui/icons-material/Send";

import { Helmet } from 'react-helmet';


const Dishboard = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#ff1f1f",
      },
      secondary: {
        main: "#4fc2c7",
      },
    },
  });

  // style de la modal CREATE
  const styleCreate = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //Modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = useState(false);
  const [dishId, setDishId] = useState("");
  const [dishes, setDishes] = useState([]);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openForAdd, setOpenForAdd] = useState(false);
  const handleOpenForAdd = () => setOpenForAdd(true);
  const handleCloseForAdd = () => setOpenForAdd(false);
  const [dishCreate, setDishCreate] = useState({
    Dish_Name: "",
    Dish_Price: 0,
    Restaurant_ID: "",
    Restaurant_List: [],
  });
  const [dishData, setDishData] = useState({
    Dish_Name: "",
    Dish_Price: 0,
    Restaurant_ID: "",
    Restaurant_List: [],
  });
  const [rowToUpdate, setRowToUpdate] = useState({
    id: "",
    col1: "",
    col2: "",
    col3: "",
    col4: "",
    col5: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fetchDishes = async () => {
    try {
      const data = await axios.get("http://localhost:3002/dishes");
      setDishes(data.data);
      const newRows = data.data.map((dish) => {
        return {
          id: dish._id,
          col1: dish._id,
          col2: dish.Dish_Name,
          col3: dish.Dish_Price,
          col4: dish.Restaurant_ID,
          col5: dish.Restaurant_List,
        };
      });
      setRows(newRows);

      const newColumns = [
        { field: "col1", headerName: "ID", width: 235 },
        { field: "col2", headerName: "Name", width: 140 },
        { field: "col3", headerName: "Price", width: 80 },
        { field: "col4", headerName: "Restaurant_ID", width: 235 },
        { field: "col5", headerName: "Restaurant_List", width: 235 },
        {
          field: "col6",
          headerName: "Edit",
          width: 60,
          renderCell: (rowData) => (
            <EditIcon
              color="secondary"
              id={rowData.id}
              onClick={(e) => {
                e.preventDefault();
                console.log("ROWDATA", rowData.row);
                setRowToUpdate(rowData.row);
                handleOpen();
                setDishId(rowData.id);
                setDishData({
                  ...dishData,
                  Dish_Name: rowData.row.col2,
                  Dish_Price: rowData.row.col3,
                  Restaurant_ID: rowData.row.col4,
                  Restaurant_List: rowData.row.col5,
                });
                console.log("préname", rowData.row.col2);
                console.log("préPrice", rowData.row.col3);
                console.log("préRestId", rowData.row.col4);
              }}
            />
          ),
        },
        {
          field: "col7",
          headerName: "Delete",
          width: 80,
          renderCell: (rowData) => (
            <DeleteIcon
              onClick={() => {
                deleteDish(rowData.id);
                notifyDelete();
              }}
            />
          ),
        },
      ];
      setColumns(newColumns);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchDishes();
  }, []);

  const deleteDish = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/dishes/${id}`);
      fetchDishes();
    } catch (err) {
      console.log(err);
    }
    setRows((prevRows) => {
      return prevRows.filter((row) => row.id !== id);
    });
  };

  async function getDish(id) {
    const config = {
      method: "get",
      url: `http://localhost:3002/dishes/${id}`,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        console.log(response.data);
        // setDishUpdate(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    window.location.reload();
  }

  async function createDish() {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dishCreate),
      };
      const response = await fetch(
        `http://localhost:3002/dishes`,
        requestOptions
      );
      const data = await response.json();
      const newRow = {
        id: data._id,
        col1: data._id,
        col2: data.Dish_Name,
        col3: data.Dish_Price,
        col4: data.Restaurant_ID,
        col5: data.Restaurant_List,
      };
      setRows([...rows, newRow]);
      handleCloseForAdd();
      toast.success("Restaurant successfully added");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the restaurant");
    }
    // notifyCreate();
  }

  const handleEditChange = (e) => {
    if (
      !e.target.value ||
      e.target.value === "" ||
      e.target.value === 0 ||
      e.target.value === []
    ) {
      // console.log("NO EVENT");
      setDishData({
        ...dishData,
        [e.target.name]: dishData.value,
      });
    } else {
      // console.log("THERE IS EVENT");
      setDishData({
        ...dishData,
        [e.target.name]: e.target.value,
      });
    }
  };

  async function updateDish(_id) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dishData),
    };
    const response = await fetch(
      `http://localhost:3002/dishes/${_id}`,
      requestOptions
    );
    const data = await response.json();
    console.log("updated dish =>", data);
    // window.location.reload();
  }

  const handleEditClick = (e) => {
    handleEditChange(e);
    updateDish(dishId);
    notifyEdit();
    for (const row of rows) {
      if (row.id.includes(dishId)) {
        const theRow = row;
        console.log("ROW TO Update =>", theRow);
        setRowToUpdate({
          ...rowToUpdate,
          col2: dishData.Dish_Name,
          col3: dishData.Dish_Price,
          col4: dishData.Restaurant_ID,
          col5: dishData.Restaurant_List,
        });
        console.log("UPDATED ROW =>", dishData);
        console.log("UPDATED name", dishData.Dish_Name);
      }
      const updatedRow = {
        ...rowToUpdate,
        col2: dishData.Dish_Name,
        col3: dishData.Dish_Price,
        col4: dishData.Restaurant_ID,
        col5: dishData.Restaurant_List,
      };
      const updatedRows = rows.map((row) => {
        if (row.id === dishId) {
          return updatedRow;
        }
        return row;
      });
      setRows(updatedRows);
    }
    handleClose();
  };

  // Toaster

  const notifyDelete = () => toast("Successfully deleted!");

  const notifyEdit = () => toast("Successfully edited!");


  // Form's visibility

  const showForm = (e) => {
    document.getElementById("add-form").style.display = "block";
  };

  const hideForm = (e) => {
    document.getElementById("add-form").style.display = "none";
    window.location.reload(false);
  };

  const [cartItems, setCartItems] = useState([]);

  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.Dish_Price, 0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = 20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      const newCartItems = cartItems.map((x) =>
        x.id === product.id ? { ...x, qty: x.qty + 1 } : x
      );
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    } else {
      const newCartItems = [...cartItems, { ...product, qty: 1 }];
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      const newCartItems = cartItems.filter((x) => x.id !== product.id);
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    } else {
      const newCartItems = cartItems.map((x) =>
        x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
      );
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
  };

  let countCartItems = cartItems.length;

  useEffect(() => {
    setCartItems(
      localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : []
    );
  }, []);

  return (
    <div>

<Helmet>
        <title>Epeat | Crud Dish</title>
      </Helmet>

      
      <Navbar
        countCartItems={countCartItems}
        itemsPrice={itemsPrice}
        shippingPrice={shippingPrice}
        taxPrice={taxPrice}
        totalPrice={totalPrice}
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
      />
      <ToastContainer />
      <Button
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          handleOpenForAdd();
        }}
        style={{
          minWidth: 170,
          maxWidth: 170,
          marginTop: 120,
          marginLeft: "5%",
        }}
      >
        Add a dish
      </Button>
      <div style={{ marginLeft: "50%" }}>
        <Link to="/crudrestaurants" className="btn btn-2">
          CRUD RESTAURANT
        </Link>
        <Link to="/admin/users" className="btn btn-5">
          CRUD USER
        </Link>
      </div>
      {/* Modal Create Resto */}
      <Modal
        open={openForAdd}
        onClose={handleCloseForAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleCreate}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a new dish
          </Typography>

          <TextField
            id="outlined-basic"
            name="Dish_Name"
            label="Name"
            variant="outlined"
            onChange={(e) =>
              setDishCreate({
                ...dishCreate,
                Dish_Name: e.target.value,
              })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            id="outlined-basic"
            name="Dish_Price"
            label="Price"
            variant="outlined"
            onChange={(e) =>
              setDishCreate({
                ...dishCreate,
                Dish_Price: e.target.value,
              })
            }
            sx={{ mt: 2, ml: 2 }}
          />
          <TextField
            id="outlined-basic"
            name="Restaurant_ID"
            label="Original restaurant"
            variant="outlined"
            onChange={(e) =>
              setDishCreate({
                ...dishCreate,
                Restaurant_ID: e.target.value,
              })
            }
            sx={{ mt: 2, width: "100%" }}
          />
          <TextField
            id="outlined-basic"
            name="Restaurants_List"
            label="Restaurants List"
            variant="outlined"
            onChange={(e) =>
              setDishCreate({
                ...dishCreate,
                Restaurant_List: e.target.value,
              })
            }
            sx={{ mt: 2, width: "100%" }}
          />
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            endIcon={<SendIcon />}
            onClick={createDish}
          >
            Send
          </Button>
        </Box>
      </Modal>
      <div
        style={{
          display: "flex",
          height: "800px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            height: "90%",
            width: "90%",
          }}
        >
          <div style={{ flexGrow: 1 }}>


            <ThemeProvider theme={theme}>
              <DataGrid
                columns={columns}
                rows={rows}
                data={dishes}
                style={{ textAlign: "center" }}
              />
              {/* Modal EDIT Dish */}
              {dishes.map((dish, index) => {
                return (
                  <Modal
                    key={index}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="outlined-basic"
                        variant="h6"
                        component="h2"
                      >
                        Edit a dish
                      </Typography>

                      <TextField
                        id="outlined-basic"
                        name="Dish_Name"
                        label="Name"
                        defaultValue={dishData.Dish_Name}
                        onChange={(e) => handleEditChange(e)}
                        // required
                      />
                      <TextField
                        id="outlined-basic"
                        name="Dish_Price"
                        label="Price"
                        defaultValue={dishData.Dish_Price}
                        onChange={(e) => handleEditChange(e)}
                        // required
                      />

                      <TextField
                        id="outlined-basic"
                        name="Restaurant_ID"
                        label="Restaurant ID"
                        defaultValue={dishData.Restaurant_ID}
                        onChange={(e) => handleEditChange(e)}
                        // required
                      />
                      <TextField
                        id="outlined-basic"
                        name="Restaurant_List"
                        label="Restaurant List"
                        defaultValue={dishData.Restaurant_List}
                        onChange={(e) => handleEditChange(e)}
                      />

                      <Button
                        sx={{
                          mt: 3,
                          backgroundColor: "#2196f3",
                          "&:hover": { backgroundColor: "#00e676" },
                        }}
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleEditClick}
                      >
                        Send
                      </Button>
                    </Box>
                  </Modal>
                );
              })}
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dishboard;
