import React, { useEffect } from "react";
import { Collapse, Popconfirm, Tree } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadFile } from "../../api/users";

const { Panel } = Collapse;

const LeftPanel = ({ fileData }) => {
  const handleDownload = async (fileId, filename) => {
    try {
      const blobData = await downloadFile(fileId);

      // Create a Blob from the response data
      const blob = new Blob([blobData], { type: "application/octet-stream" });

      // Create a link element
      const link = document.createElement("a");

      // Set the download attribute and create a URL for the blob
      link.download = `${filename || `file_${fileId}`}.L5X`; // Include ".L5X" in the filename
      link.href = window.URL.createObjectURL(blob);

      // Append the link to the document body and trigger a click
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const transformControllerData = (controllerArray) => {
    return controllerArray.map((item, index) => ({
      key: item,
      title: item,
      items: [], // You can add children based on your data structure
    }));
  };

  useEffect(() => {}, []);
  return (
    <div
      className="bg-light bg-gradient"
      style={{
        padding: "8px",
        border: "1px solid #d9d9d9",
        borderRadius: "5px",
        height: "100%", // Set height to 100%
        overflowX: "auto", // or "scroll" to always show the scrollbar
      }}
    >
      {" "}
      <Collapse accordion className="bg-secondary">
        {fileData.map((file) => (
          <Panel
            header={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  overflowX: "auto",
                }}
              >
                <span className="h6">{file.filename}</span>
                <Popconfirm
                  title="Are you sure you want to download this file?"
                  onConfirm={() => handleDownload(file.fileId, file.filename)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DownloadOutlined
                    style={{ fontSize: "20px", color: "blue" }}
                  />
                </Popconfirm>
              </div>
            }
            key={file.fileId}
          >
            {/* <p>File ID: {file.fileId}</p>
            <p>File Time: {file.filetime}</p> */}

            {/* Render Ant Design Tree */}
            <Tree
              showLine
              switcherIcon={<DownloadOutlined />}
              defaultExpandedKeys={["0-0-0"]}
              treeData={transformControllerData(
                file.filetree.RSLogix5000Content.Controller
              )}
              style={{
                overflowX: "auto",
                overflowY : "hidden"
              }}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default LeftPanel;
