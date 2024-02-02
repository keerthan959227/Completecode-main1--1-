import React, { useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBCollapse,
  MDBIcon,
} from "mdb-react-ui-kit";
import ScrollIntoView from "react-scroll-into-view";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { pink } from "@mui/material/colors";

export default function TransNav() {
  const [showNav, setShowNav] = useState(false);

  return (
    <MDBNavbar
       sdfg
      expand="sm"
      sticky
      transparent
      light
      bgColor="dark"
      className="bg-opacity-75 shadow-lg navbarmain"
    >
      <MDBNavbarBrand href="#">
        <AcUnitIcon
          sx={{ color: pink[500], fontSize: 50 }}
          id="iconrotatenav"
        />
      </MDBNavbarBrand>
    </MDBNavbar>
  );
}
