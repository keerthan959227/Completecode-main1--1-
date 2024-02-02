import React, { useEffect, useState } from "react";
import LeftPanel from './Leftpanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import { getFileData } from "../../api/users";
import { Spin } from "antd";

const Homepage = () => {
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserFile = async () => {
    try {
      const response = await getFileData();
      //console.log(response)
      if (response.success) {
        setFileData(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserFile();
    } else {
      // Handle the case when there's no token (e.g., navigate to login)
    }
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '80%' }}>
        <div style={{ width: '20%', marginRight: '5px',height: '100vh'}}       
        >
          {loading ? (
            <Spin size="large" />
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <LeftPanel fileData={fileData} 
            />
          )}
        </div>
        <div style={{ flex: 1, margin: '0 10px' }}>
          <CenterPanel />
        </div>
        <div style={{ width: '20%', marginLeft: '10px' }}>
          <RightPanel />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
