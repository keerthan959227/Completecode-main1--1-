import React, { useState, useEffect } from 'react';
import LeftPanel from './LeftPanel';
import RightPanel from './Rightpanel';

const Home = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [AOIChildrenData, setAOIChildrenData] = useState(null); // New state for AOIChildrenData

  useEffect(() => {
    // Fetch tree data from the server
    fetch('http://localhost:5000/ir96gc1/getXmlTree')
      .then(response => response.json())
      .then(data => setTreeData(data.treeStructure))
      .catch(error => console.error('Error fetching tree data:', error));
  }, []);

  const onSelect = (_, info) => {
    // Handle selection logic
    console.log('Selected node:', info.node);
  
    // Access immediate parent node title
    const parentTitle =
      info.node.parent &&
      info.node.parent.title &&
      info.node.parent.title.props &&
      info.node.parent.title.props.children &&
      info.node.parent.title.props.children[1];
  
    //console.log('Immediate parent node title:', parentTitle);
  
    // Extract title from the React element
    const title =
      info.node.title &&
      info.node.title.props &&
      info.node.title.props.children &&
      info.node.title.props.children[1];
  
    console.log('Selected node title:', title);
  
    // Assuming AOIChildrenData is stored in the node's data property
    const AOIData = info.node.data && info.node.data.AOIData;
    setAOIChildrenData(AOIData);
  
    setSelectedItem(info.node);
  };
  
  


  
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Panel */}
      <div 
      style={{ width: '350px', backgroundColor: '#e0e0e0', padding: '10px', overflowY: 'auto' }}
      >
        <LeftPanel onSelect={onSelect} />
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
        <RightPanel selectedItem={selectedItem} AOIChildrenData={AOIChildrenData} />
      </div>
    </div>
  );
};

export default Home;
