import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import MoreIcon from "@mui/icons-material/MoreVert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import Image from "mui-image";
import { accountService } from "../../_service/account_service";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(10),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
  },
}));

  export default function Navbar(props) {
  const [searchTerm, setSearchTerm] = useState(" ");
  const [Restaurants, setRestaurant] = useState([]);
  const [restaurantNames, setRestaurantNames] = useState({});
  const [statut, setStatut] = useState([]);
  const [id, setId] = useState([]);

  const [noResults, setNoResults] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    async function filterRestaurants() {
      const response = await fetch("http://localhost:3002/restaurants");
      let data = await response.json();
      setRestaurant(data);
      console.log(noResults);
      const filteredData = data.filter((item) => {
        const searchFields = [
          item.category.toLowerCase(),
          item.name.toLowerCase(),
        ];
        return searchFields.some((field) =>
          field.includes(searchTerm.toLowerCase())
        );
      });

      console.log("data filtrée", filteredData);
      if (filteredData.length === 0) {
        setNoResults(true);
        props.state(noResults);
      } else {
        setNoResults(false);
        props.func(filteredData);
        props.state(false);
      }
    }
    filterRestaurants();
  }, [searchTerm]);

  useEffect(() => {
    if (props.cartItems && Restaurants) {
      const updatedRestaurantNames = {};
      props.cartItems.forEach((item) => {
        const restaurant = Restaurants.find(
          (restaurant) => restaurant._id === item.Restaurant_ID
        );
        if (restaurant) {
          updatedRestaurantNames[item.Restaurant_ID] = restaurant.name;
        }
      });
      setRestaurantNames(updatedRestaurantNames);
    }
  }, [props.cartItems, Restaurants]);

  useEffect(() => {
    setStatut(localStorage.getItem("statut"));
    setId(localStorage.getItem("id"));
  }, [statut, id]);

  let navigate = useNavigate();

  const [shoppingBasketAnchorEl, setShoppingBasketAnchorEl] = useState(null);
  const [
    mobileMoreshoppingBasketAnchorEl,
    setMobileMoreShoppingBasketAnchorEl,
  ] = useState(null);

  const isMenuOpenCart = Boolean(shoppingBasketAnchorEl);
  const isMobileMenuOpenCart = Boolean(mobileMoreshoppingBasketAnchorEl);

  const handleShoppingBasketClick = (event) => {
    setShoppingBasketAnchorEl(event.currentTarget);
  };

  const handleMobileShoppingBasketClick = () => {
    setMobileMoreShoppingBasketAnchorEl(null);
  };

  const handleClose = () => {
    setShoppingBasketAnchorEl(null);
  };
  // //
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleAddToCart = (product) => {
    props.onAdd(product);
  };
  const handleRemoveToCart = (product) => {
    props.onRemove(product);
  };

  const [Userid, setUserid] = useState([]);
  useEffect(() => {
    setUserid(localStorage.getItem("id"));
  }, []);

  const logout = () => {
    accountService.logout();
    window.location.reload();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        {!id && (
          <Link to="/Auth">
            {" "}
            <AccountCircle />
            Signin/Signup
          </Link>
        )}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        {id && (
          <Link to={"/profile/user/?id=" + Userid}>
            {" "}
            <PersonIcon />
            My account
          </Link>
        )}
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        {statut === "admin" ? (
          <Link to="/Dashboardadmin">
            {" "}
            <AdminPanelSettingsIcon />
            Admin
          </Link>
        ) : null}
      </MenuItem>

      {id && (
        <MenuItem onClick={logout}>
          {" "}
          <LoginIcon />
          Logout
        </MenuItem>
      )}
    </Menu>
  );
  const [TotalPrice, setTotalPrice] = useState([]);
  const SaveTotalToLocalstorage = () => {
    setTotalPrice(localStorage.setItem("Total", props.totalPrice));
  };

  const menuIdCart = "primary-search-account-menu";
  const renderMenuCart = (
    <Menu
      anchorEl={shoppingBasketAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuIdCart}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpenCart}
      onClose={handleClose}
    >
      {props.cartItems && props.cartItems.length === 0 && (
        <MenuItem>Cart is empty</MenuItem>
      )}
      {props.cartItems &&
        props.cartItems.map((item) => (
          <div
            style={{
              width: "220px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <h4 key={item.id}>{item.Dish_Name}</h4>

            <h6 style={{ marginTop: 5 }}>
              {restaurantNames[item.Restaurant_ID]}
            </h6>

            <div>
              &nbsp;<button onClick={() => handleRemoveToCart(item)}>-</button>
              &nbsp;{item.qty}&nbsp;
              <button onClick={() => handleAddToCart(item)}>+</button>&nbsp; x{" "}
              {item.Dish_Price}€
            </div>
          </div>
        ))}

      {props.cartItems && props.cartItems.length !== 0 && (
        <>
          <Divider />
          <MenuItem> Dishes Price: {props.itemsPrice.toFixed(2)}€</MenuItem>
          <MenuItem> TVA: {props.taxPrice.toFixed(2)}€</MenuItem>
          <MenuItem> Shipping: {props.shippingPrice.toFixed(2)}€</MenuItem>
          <MenuItem> Total: {props.totalPrice.toFixed(2)}€</MenuItem>
          <Button
            onClick={SaveTotalToLocalstorage}
            variant="contained"
            color="success"
          >
            <Link to={{ pathname: "/stripe" }}>Update cart and pay</Link>
          </Button>
        </>
      )}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {id && (
        <MenuItem onClick={handleShoppingBasketClick}>
          <IconButton
            size="large"
            aria-label="show 4 new mails"
            color="inherit"
          >
            <Badge badgeContent={props.countCartItems} color="error">
              <ShoppingBasketIcon />
            </Badge>
          </IconButton>
          <p>Cart</p>
        </MenuItem>
      )}
      {!id && (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Link to="/Auth">
            <p>Signin/Signup</p>
          </Link>
        </MenuItem>
      )}

      {statut === "admin" ? (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AdminPanelSettingsIcon />
          </IconButton>
          <Link to="/Dashboardadmin">
            <p>Admin</p>
          </Link>
        </MenuItem>
      ) : null}
      {id && (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <PersonIcon />
          </IconButton>
          <Link to={"/profile/user/?id=" + Userid}>
            <p>My account</p>
          </Link>
        </MenuItem>
      )}
      {id && (
        <MenuItem onClick={logout}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <LoginIcon />
          </IconButton>
          <p>Logout</p>
        </MenuItem>
      )}
    </Menu>
  );

  const theme = createTheme({
    palette: {
      primary: red,
    },
  });

  const location = useLocation();

  const handleClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Link to={{ pathname: "/" }} onClick={handleClick}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <Image
                  src={require("./LogoSTT.png")}
                  style={{ width: 170, height: 100 }}
                />
              </Typography>
            </Link>
            {window.location.pathname === "/" && (
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearch}
                />
              </Search>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {id && (
                <IconButton
                  size="large"
                  edge="end"
                  aria-controls={menuIdCart}
                  aria-haspopup="true"
                  onClick={handleShoppingBasketClick}
                  aria-label="show 4 new mails"
                  color="inherit"
                >
                  <Badge badgeContent={props.countCartItems} color="error">
                    <ShoppingBasketIcon />
                  </Badge>
                </IconButton>
              )}

              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
        {renderMenuCart}
      </Box>
    </ThemeProvider>
  );
}
