import React, { useState } from "react";
import { Modal, Collapse, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  CGL5370,
  CGL5380,
  CMPTL5370,
  CMPTL5380,
  CMPTL5480,
  CNTRL5570,
  CNTRL5580,
  GRDL5570,
  GRDL5580,
  Studio5000,
} from "./Processors";

//Unicode character for superscript "R" (&#174;)
//Superscript "TM" (trademark) in plain text, you can use the Unicode character &#x2122
const { Panel } = Collapse;
function NewProjectModel({ controllerSelect }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [value, setValue] = useState("");

  const onChange1 = (v) => {
    //    console.log(`selected ${v}`);
    setValue(v);
  };
  const onSearch1 = (value) => {
    //console.log("search:", value);
  };

  const filterOption1 = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    controllerSelect(value);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleChange = () => {
    // Handle changes in Collapse (if needed)
  };

  return (
    <div>
      <Button
        type="dashed"
        onClick={showModal}
        icon={<PlusOutlined />}
        style={{
          background: "#FFD6E7",
          borderColor: "#FF85BF",
          color: "#FF006E",
        }}
      >
        Select Controller
      </Button>
      <Modal
        title="Select The Controller"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Collapse accordion onChange={handleChange} size="small" ghost>
          <Panel
            header="Compact GuardLogix&#174; 5370 Safety Controller"
            key="compact-guardlogix-5370"
            className="custom-collapse-panel"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={CGL5370}
            />
          </Panel>

          <Panel
            header="Compact GuardLogix&#174; 5380 Safety Controller"
            key="compact-guardlogix-5380"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={CGL5380}
            />
          </Panel>

          <Panel
            header="CompactLogix&#x2122; 5370 Controller"
            key="compact-5370"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={CMPTL5370}
            />
          </Panel>

          <Panel
            header="CompactLogix&#x2122; 5380 Controller"
            key="compact-5380"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={CMPTL5380}
            />
          </Panel>

          <Panel
            header="CompactLogix&#x2122; 5480 Controller"
            key="compact-5480"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={CMPTL5480}
            />
          </Panel>

          <Panel header="ControlLogix&#174; 5570 Controller" key="control-5570">
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={CNTRL5570}
            />
          </Panel>

          <Panel header="ControlLogix&#174; 5580 Controller" key="control-5580">
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={CNTRL5580}
            />
          </Panel>

          <Panel
            header="GuardLogix&#174; 5570 Safety Controller"
            key="control-guardlogix-5570"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={GRDL5570}
            />
          </Panel>

          <Panel
            header="GuardLogix&#174; 5580 Safety Controller"
            key="control-guardlogix-5580"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={GRDL5580}
            />
          </Panel>

          <Panel
            header="Studio 5000&#174; Logix Emulate&#x2122; Controller"
            key="Emulator5000"
          >
            <Select
              showSearch
              placeholder="Select the type"
              optionFilterProp="children"
              onChange={onChange1}
              onSearch={onSearch1}
              filterOption={filterOption1}
              style={{
                width: "100%",
              }}
              options={Studio5000}
            />
            
          </Panel>
        </Collapse>
      </Modal>
    </div>
  );
}

export default NewProjectModel;
