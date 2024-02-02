import React, { useEffect } from "react";
import { GetCurrentuser } from "../api/users";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LogoutIcon from "@mui/icons-material/Logout";
import TransNav from "../pages/NewProject/NavBar";

function ProtecdRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getCurrentUser = async () => {
    try {

      const response = await GetCurrentuser();


      if (response.success) {
        dispatch(SetUser(response.data));

        message.success("Login succesful");
      } else {
        dispatch(SetUser(null));
         message.error(response.message);
      }
    } catch (error) {
      //setUser(null);
      dispatch(SetUser(null));
      return error.message;
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);
  return (
    user && (
      <div>
        <TransNav/>
        {children}

      </div>
    )
  );
}

export default ProtecdRoute;
