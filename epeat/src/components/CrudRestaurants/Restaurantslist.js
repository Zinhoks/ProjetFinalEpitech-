import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField, Button } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../DashboardAdmin/dashboardadmin.css";

import { Helmet } from "react-helmet";

const Restaurantslist = () => {
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
  // style de la modal EDIT
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    height: 200,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

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
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    category: "",
    image: "",
  });
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);
  const [restaurantCreate, setRestaurantCreate] = useState({
    name: "",
    address: "",
    category: "",
    image: "",
  });
  const [rowToUpdate, setRowToUpdate] = useState({
    id: "",
    col1: "",
    col2: "",
    col3: "",
    col4: "",
    col5: "",
  });
  const [rowToDelete, setRowToDelete] = useState({
    id: "",
    col1: "",
    col2: "",
    col3: "",
    col4: "",
    col5: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openForAdd, setOpenForAdd] = useState(false);
  const handleOpenForAdd = () => setOpenForAdd(true);
  const handleCloseForAdd = () => setOpenForAdd(false);

  const fetchData = async () => {
    try {
      const data = await axios.get("http://localhost:3002/restaurants");
      setRestaurants(data.data);
      const newRows = data.data.map((restaurant) => {
        return {
          id: restaurant._id,
          col1: restaurant._id,
          col2: restaurant.name,
          col3: restaurant.address,
          col4: restaurant.category,
          col5: restaurant.image,
        };
      });
      setRows(newRows);

      const newColumns = [
        { field: "col1", headerName: "ID", width: 250 },
        { field: "col2", headerName: "Name", width: 150 },
        { field: "col3", headerName: "Address", width: 150 },
        { field: "col4", headerName: "Category", width: 150 },
        { field: "col5", headerName: "Image", width: 150 },
        {
          field: "col6",
          headerName: "Edit",
          width: 75,
          renderCell: (rowData) => (
            <EditIcon
              color="secondary"
              id={rowData.id}
              onClick={(e) => {
                e.preventDefault();
                console.log("ROWDATA", rowData.row);
                setRowToUpdate(rowData.row);
                handleOpen();
                setRestaurantId(rowData.id);
                setRestaurantData({
                  ...restaurantData,
                  name: rowData.row.col2,
                  address: rowData.row.col3,
                  category: rowData.row.col4,
                  image: rowData.row.col5
                });
              }}
            />
          ),
        },
        {
          field: "col7",
          headerName: "Delete",
          width: 75,
          renderCell: (rowData) => (
            <div>
              <DeleteRoundedIcon
                onClick={() => {
                  deleteRestaurant(rowData.id);
                  notifyDelete();
                }}
                color="primary"
              />
            </div>
          ),
        },
      ];
      setColumns(newColumns);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [file, setFile] = useState();
  const [imageName, setImageName] = useState();
  const [imagePath, setImagePath] = useState();

  async function uploadImage() {
    const formData = new FormData();
    formData.append("image", file);
    console.log(file)

    const result = await axios.post(
      "http://localhost:3002/restaurants/images",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log(formData)
    setImageName(result.data.imageName);
    setImagePath(result.data.imagePath);
    setRestaurantCreate({ ...restaurantCreate, image: imagePath });
    console.log("uploadImage Path", imagePath);   
  }

  async function createRestaurant() {
    try {
      uploadImage();
      console.log("1", restaurantCreate);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantCreate),
      };
      const response = await fetch(
        `http://localhost:3002/restaurants`,
        requestOptions
      );
      const data = await response.json();
      const newRow = {
        id: data._id,
        col1: data._id,
        col2: data.name,
        col3: data.address,
        col4: data.category,
        col5: data.image,
      };
      setRows([...rows, newRow]);
      handleCloseForAdd();
      toast.success("Restaurant successfully added");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding the restaurant");
    }
  }

  async function deleteRestaurant(id) {
    let url = `http://localhost:3002/restaurants/${id}`;
    await axios
      .delete(url)
      .then(function (response) {
        console.log("COUCOU", response.data);
        setRowToDelete(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setRows((prevRows) => {
      return prevRows.filter((row) => row.id !== id);
    });
  }

  const handleEditChange = (e) => {
    if (!e.target.value || e.target.value === "") {
      setRestaurantData({
        ...restaurantData,
        [e.target.name]: restaurantData.value,
      });
    } else {
      setRestaurantData({
        ...restaurantData,
        [e.target.name]: e.target.value,
      });
    }
    console.log("handleEditChange",restaurantData)
  };

  async function updateRestaurant(id) {
    uploadImage();
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      body: JSON.stringify(restaurantData),
    };
    console.log("body", JSON.stringify(restaurantData))
    const response = await fetch(
      `http://localhost:3002/restaurants/${id}`,
      requestOptions
    );
    const data = await response.json();
    console.log("updated restaurant =>", data);
  }

  const handleEditClick = (e) => {
    uploadImage();
    handleEditChange(e);
    updateRestaurant(restaurantId);
    notifyEdit();
    for (const row of rows) {
      if (row.id.includes(restaurantId)) {
        const theRow = row;
        console.log("ROW TO Update =>", theRow);
        setRowToUpdate({
          ...rowToUpdate,
          col2: restaurantData.name,
          col3: restaurantData.address,
          col4: restaurantData.category,
        });
        console.log("UPDATED ROW =>", restaurantData);
        console.log("UPDATED Adress", restaurantData.address);
      }
      const updatedRow = {
        ...rowToUpdate,
        col2: restaurantData.name,
        col3: restaurantData.address,
        col4: restaurantData.category,
        col5: restaurantData.image,
      };
      const updatedRows = rows.map((row) => {
        if (row.id === restaurantId) {
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

  const notifyCreate = () => toast("Successfully created!");

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
        <title>Epeat | Crud Restaurant</title>
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

      <Navbar />
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
        Add a restaurant
      </Button>
      <div style={{ marginLeft: "50%" }}>
        <Link to="/admin/users" className="btn btn-5">
          CRUD USER
        </Link>
        <Link to="/dish-crud" className="btn btn-3">
          CRUD DISHES
        </Link>
      </div>

      {/* Modal Create Resto */}
      <Modal
        open={openForAdd}
        onClose={handleCloseForAdd}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={styleCreate}
          style={{ backgroundColor: "white", height: "auto" }}
        >
          <div style={{ backgroundColor: "#f2f2f2", padding: "10%" }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ fontFamily: "Bukhari Script" }}
            >
              Create a new restaurant
            </Typography>

            <TextField
              id="outlined-basic"
              name="name"
              label="Name"
              variant="outlined"
              onChange={(e) =>
                setRestaurantCreate({
                  ...restaurantCreate,
                  name: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
            <TextField
              id="outlined-basic"
              name="category"
              label="Category"
              variant="outlined"
              onChange={(e) =>
                setRestaurantCreate({
                  ...restaurantCreate,
                  category: e.target.value,
                })
              }
              sx={{ mt: 2, ml: 2 }}
            />
            <TextField
              id="outlined-basic"
              name="address"
              label="Address"
              variant="outlined"
              onChange={(e) =>
                setRestaurantCreate({
                  ...restaurantCreate,
                  address: e.target.value,
                })
              }
              sx={{ mt: 2, width: "100%" }}
            />
            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <input
                filename={file}
                onChange={(e) =>
                  setRestaurantCreate({
                    ...restaurantCreate,
                    image: setFile(e.target.files[0]),
                  })
                }
                type="file"
                accept="image/*"
              ></input>
              <Button variant="outlined" onClick={(e) => {e.preventDefault(); uploadImage()} }>
                Save
              </Button>
            </div>
            <Button
              sx={{ mt: 3 }}
              variant="contained"
              endIcon={<SendIcon />}
              onClick={createRestaurant}
            >
              Send
            </Button>
          </div>
        </Box>
      </Modal>
      <div
        style={{
          display: "flex",
          height: "800px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", height: "90%", width: "90%" }}>
          <div style={{ flexGrow: 1 }}>
            <ThemeProvider theme={theme}>
              <DataGrid
                autoHeight
                columns={columns}
                rows={rows}
                data={restaurants}
              />
              {/* Modal EDIT Resto */}
              {restaurants.map((restaurant, index) => {
                return (
                  <Modal
                    key={index}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={style}
                      style={{ backgroundColor: "white", height: "auto" }}
                    >
                      <div
                        style={{ backgroundColor: "#f2f2f2", padding: "3%" }}
                      >
                        <Typography
                          id="outlined-basic"
                          variant="h6"
                          component="h2"
                        >
                          <span style={{ fontFamily: "Bukhari Script" }}>
                            Update restaurant
                          </span>
                        </Typography>
                        <TextField
                          style={{ margin: "3% auto", width: "100%" }}
                          id="outlined-basic"
                          name="name"
                          label="New name"
                          variant="outlined"
                          defaultValue={restaurantData.name}
                          onChange={(e) => handleEditChange(e)}
                        />
                        <TextField
                          style={{ margin: "3% auto", width: "100%" }}
                          id="outlined-basic"
                          name="address"
                          label="New address"
                          variant="outlined"
                          defaultValue={restaurantData.address}
                          onChange={(e) => handleEditChange(e)}
                        />
                        <TextField
                          style={{ margin: "3% auto", width: "100%" }}
                          id="outlined-basic"
                          name="category"
                          label="New category"
                          variant="outlined"
                          defaultValue={restaurantData.category}
                          onChange={(e) => handleEditChange(e)}
                        />
                        {/* <div>
                        <p>Edit image</p>
                        <FileBase64
                          type="file"
                          multiple={false}
                          onDone={({ base64 }) =>
                            setRestaurantUpdate({
                              ...restaurantUpdate,
                              image: base64,
                            })
                          }
                        />
                      </div> */}                        
                        <div
                          style={{
                            marginTop: 20,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <input
                            filename={file}
                            onChange={(e) =>
                              setRestaurantCreate({
                                ...restaurantCreate,
                                image: setFile(e.target.files[0]),
                              })
                            }
                            type="file"
                            accept="image/*"
                          ></input>
                          <Button
                            variant="outlined"
                            onClick={() => uploadImage()}
                          >
                            Save
                          </Button>
                        </div>
                        {/* <input type='file' name='file' onChange={uploadUpdate} /> */}
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
                      </div>
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

export default Restaurantslist;
