import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Userlist.css";

import { Helmet } from 'react-helmet';


const UserList = () => {
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
  const [users, setUsersData] = useState([]);
  const [userId, setUserId] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [open, setOpen] = useState(false);
  const [userDefault, setUserDefault] = useState({
    username: "",
    email: "",
    status: "",
  });
  const [userUpdate, setUserUpdate] = useState({
    username: "",
    email: "",
    status: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    try {
      const data = await axios.get("http://localhost:3002/admin/users");
      setUsersData(data.data);
      setUserDefault(data.data);
      const newRows = data.data.map((user) => {
        return {
          id: user._id,
          // col1: user._id,
          col2: user.username,
          col3: user.email,
          col4: user.password,
          col5: user.address,
          col6: user.status,
        };
      });
      setRows(newRows);

      const newColumns = [
        // { field: "col1", headerName: "ID", width: 250 },
        { field: "col2", headerName: "Username", width: 150 },
        { field: "col3", headerName: "Email", width: 150 },
        { field: "col4", headerName: "Password", width: 150 },
        { field: "col5", headerName: "Address", width: 150 },
        { field: "col6", headerName: "Status", width: 150 },
        {
          field: "col7",
          headerName: "Edit",
          width: 150,
          renderCell: (rowData) => (
            <EditIcon
              color="secondary"
              id={rowData.id}
              onClick={(e) => {
                e.preventDefault();
                handleOpen();
                setUserId(rowData.id);
                setUserDefault({
                  ...userDefault,
                  name: rowData.row.col2,
                  email: rowData.row.col3,
                  status: rowData.row.col6,
                });
                console.log(rowData.row.col2);
              }}
            />
          ),
        },
        {
          field: "col8",
          headerName: "Delete",
          width: 100,
          renderCell: (rowData) => (
            <div>
              <DeleteRoundedIcon
                onClick={() => {
                  deleteUser(rowData.id);
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

  async function deleteUser(id) {
    let url = `http://localhost:3002/admin/users/${id}`;
    await axios
      .delete(url)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    window.location.reload();
  }

  async function updateUser(id) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userUpdate),
    };
    const response = await fetch(
      `http://localhost:3002/admin/users/${id}`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);

    window.location.reload();
  }

  // Toaster
  const notifyDelete = () => toast("The user was deleted with success!");

  const notifyUpdate = () => toast("The information was updated with success!");

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
    // console.log(cartItems);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Epeat | Crud Users</title>
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

      <div style={{ marginLeft: "40%", marginTop: "9%" }}>
        <Link to="/crudrestaurants" className="btn btn-2">
          CRUD RESTAURANT
        </Link>
        <Link to="/dish-crud" className="btn btn-3">
          CRUD DISHES
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          height: "800px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <div style={{ display: "flex", height: "90%", width: "90%" }}>
          <div style={{ flexGrow: 1 }}>
            <ThemeProvider theme={theme}>
              <DataGrid columns={columns} rows={rows} data={users} />
              {users.map((user, index) => {
                return (
                  <Modal
                    key={index}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style} style={{ backgroundColor: "white" }}>
                      <div
                        style={{ backgroundColor: "#f2f2f2", padding: "10%" }}
                      >
                        <Typography
                          id="outlined-basic"
                          variant="h6"
                          component="h2"
                          fontfamily="Bukhari Script"
                        >
                          <span style={{ fontFamily: "Bukhari Script" }}>
                            Update user credentials
                          </span>
                        </Typography>
                        <TextField
                          style={{ margin: "10% auto", width: "100%" }}
                          id="outlined-basic"
                          name="username"
                          label="New username"
                          variant="outlined"
                          defaultValue={userDefault.username}
                          onChange={(e) =>
                            setUserUpdate({
                              ...userUpdate,
                              username: e.target.value,
                            })
                          }
                          required
                        />
                        <TextField
                          style={{ margin: "10% auto", width: "100%" }}
                          id="outlined-basic"
                          name="email"
                          label="New email"
                          variant="outlined"
                          defaultValue={userDefault.email}
                          onChange={(e) =>
                            setUserUpdate({
                              ...userUpdate,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                        <FormControl fullWidth id="selectForm">
                          <InputLabel id="demo-simple-select-label">
                            Toggle admin status
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="simple-select"
                            name="status"
                            label="Status"
                            defaultValue={userDefault.status}
                            onChange={(e) =>
                              setUserUpdate({
                                ...userUpdate,
                                status: e.target.value,
                              })
                            }
                          >
                            <MenuItem value="admin">Yes</MenuItem>
                            <MenuItem value="user">No</MenuItem>
                          </Select>
                        </FormControl>

                        <Button
                          id="updateSubmit"
                          variant="outlined"
                          onClick={() => {
                            updateUser(userId);
                            notifyUpdate();
                          }}
                        >
                          Submit
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

export default UserList;
