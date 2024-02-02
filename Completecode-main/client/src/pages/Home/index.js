import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import LogoutIcon from "@mui/icons-material/Logout";
import Homepage from "../../pages/NewProjectAB/Homepage"; // Replace with the actual path to Homepage
import NewProject from "../NewProject/NewProject"; // Replace with the actual path to NewProject
import { getFileData } from "../../api/users";

// Main App component
const MainHome = () => {
  const [showHomepage, setShowHomepage] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  const getAllFileData = async () => {
    try {
      const response = await getFileData();

      if (response.success) {
        // Handle success
      } else {
        // Handle failure
      }
    } catch (error) {
      // Handle error
      return error.message;
    }
  };

  const handleOpenHomepage = () => {
    setShowHomepage(true);
    setShowNewProject(false);
  };

  const handleOpenNewProject = () => {
    setShowHomepage(false);
    setShowNewProject(true);
  };

  const handleLogout = () => {
    
  };

  useEffect(() => {
    getAllFileData();
  }, []);

  return (
    <div>
    
    <AppBar position="static">
      <Toolbar style={{ justifyContent: "space-between" }}>
          <div>
            <Button
              variant="contained"
              color="primary"
              className="m-3"
              onClick={handleOpenHomepage}
            >
              Edit Project
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenNewProject}
            >
              Create New Project
            </Button>
          </div>
          <div style={{ flexGrow: 1 }}></div>

          <div>
            <Button
              color="inherit"
              onClick={handleLogout}
            >
             HOME
            </Button>
          </div>
          <div>
            <Button
            variant=" "
              color="inherit"
              onClick={handleLogout}
            >
              CONTACT
            </Button>
          </div>
          <div>
            <Button
              color="inherit"
              onClick={handleLogout}
            >
              ABOUT
            </Button>
          </div>
          <div>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Conditional rendering based on button clicks */}
      {showHomepage && <Homepage />}
      {showNewProject && <NewProject />}
    </div>
  );
};

export default MainHome;
