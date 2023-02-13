import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Restaurantslist from "./components/CrudRestaurants/Restaurantslist";
import UserList from "./components/admin/UserList";
import UserProfile from "./components/CrudUserProfile/UserProfile";
import EditProfile from "./components/CrudUserProfile/EditProfile";
import ProfileHistory from "./components/CrudUserProfile/ProfileHistory";
import DishList from "./components/Crud-Dish/Dishboard";

import FormLogin from "./components/Auth/FormLogin";
import Home from "./components/Cards/Home";
import SoloViewRestaurant from "./components/SoloRestaurant/SoloViewRestaurant";
import Stripe from "./components/stripe/StripeContainer";
import AuthGuard from "./_helpers/AuthGuard";
import AuthGuardAdmin from "./_helpers/AuthGuardAdmin";
import DashboardAdmin from "./components/DashboardAdmin/DashboardAdmin";
import Rating from "./components/Rating";
import Success from "./components/stripe/Success";
import Cardcredit from "./components/stripe/Cardcredit";

function App() {
  return (
    <Router>
      <div className="App"></div>
      <Routes>
        <Route
          path="/crudrestaurants"
          element={
            <AuthGuardAdmin>
              <Restaurantslist />
            </AuthGuardAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AuthGuardAdmin>
              <UserList />
            </AuthGuardAdmin>
          }
        />

        <Route
          path="/profile/user/"
          element={
            <AuthGuard>
              <UserProfile />
            </AuthGuard>
          }
        />
        <Route
          path="/profile/user/edit/"
          element={
            <AuthGuard>
              <EditProfile />
            </AuthGuard>
          }
        />
        <Route
          path="/dish-crud"
          element={
            <AuthGuardAdmin>
              <DishList />
            </AuthGuardAdmin>
          }
        />
        <Route path="/stripe" element={<Stripe />} />

        <Route path="/profile/user/history/" element={<ProfileHistory />} />

        <Route path="/Auth" element={<FormLogin />} />
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/" element={<SoloViewRestaurant />} />
        <Route
          path="/Dashboardadmin"
          element={
            <AuthGuardAdmin>
              <DashboardAdmin />
            </AuthGuardAdmin>
          }
        />
        <Route path="/rating" element={<Rating />} />
        <Route path="/success" element={<Success />} />
        <Route path="/test" element={<Cardcredit />} />
      </Routes>
    </Router>
  );
}

export default App;
