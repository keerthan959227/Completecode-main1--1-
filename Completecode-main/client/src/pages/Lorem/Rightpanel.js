import React from 'react';

const RightPanel = ({ selectedItem, AOIChildrenData }) => {
  return (
    <div>
      <h2>Details</h2>
      {selectedItem && (
        <div>
          <h3>Selected Item:</h3>
          <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
        </div>
      )}
      {AOIChildrenData && (
        <div>
          <h3>AOIChildrenData:</h3>
          <pre>{JSON.stringify(AOIChildrenData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
