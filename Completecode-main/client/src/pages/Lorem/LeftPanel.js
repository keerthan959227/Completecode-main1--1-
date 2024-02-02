import React, { useEffect, useState } from "react";
import { Tree, Spin } from "antd";
import {
  ClockCircleOutlined,
  DownOutlined,
  FileProtectOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const LeftPanel = ({ onSelect }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/ir96gc1/getXmlTree");
        const { TargetName, RSLogix5000Content } = await response.json();

        if (RSLogix5000Content && RSLogix5000Content.Controller) {
          const controllerChildren = RSLogix5000Content.Controller.map((child) => ({
            title: child.title || child,
            key: child.key || child,
            children: child.children || [],
          }));

          const parentWithController = {
            title: TargetName || "Default Title",
            key: "RSLogix5000Content",
            children: controllerChildren.map((controllerChild) => {
              if (controllerChild.key === "Tasks" && controllerChild.children) {
                return {
                  ...controllerChild,
                  children: controllerChild.children.map((task) => ({
                    title: task.type === "PERIODIC" ? (
                      <span>
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        {task.title}
                      </span>
                    ) : (
                      task.title
                    ),
                    key: task.key,
                    type: task.type,
                    children: task.children || [],
                  })),
                };
              } else if (
                controllerChild.key === "AddOnInstructionDefinitionsKey" &&
                controllerChild.children
              ) {
                return {
                  ...controllerChild,
                  children: controllerChild.children.map((addon) => ({
                    title: addon.encodedType === null ? (
                      <span>
                        <ProfileOutlined style={{ marginRight: 8 }} />
                        {addon.title}
                      </span>
                    ) : (
                      <span>
                        <FileProtectOutlined style={{ marginRight: 8 }} />
                        {addon.title}
                      </span>
                    ),
                    key: addon.key,
                    children: addon.children || [],
                    encodedType: addon.encodedType,
                  })),
                };
              }
              return controllerChild;
            }),
          };

          setTreeData([parentWithController]);
        }
      } catch (error) {
        console.error("Error fetching XML tree structure:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <Tree
          style={{
            width: "360px",
            padding: "10px",
            overflowY: "auto",
            maxHeight: "100vh",
          }}
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={["RSLogix5000Content"]}
          onSelect={onSelect}
          treeData={treeData}
        />
      )}
    </div>
  );
};

export default LeftPanel;
