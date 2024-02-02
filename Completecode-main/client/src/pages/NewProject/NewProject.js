import React, { useState, useEffect } from "react";
import NewProjectModel from "./NewProjectModel";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import allControllers, { controlLogixChassisTypes } from "./Processors";

const NewProject = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    processorType: "",
    slotNo: "",
    softwareVersion: "36",
    chassis: "",
    // Added slotOptions
  });
  let slotOptions = [];

  const [selectedValue, setSelectedValue] = useState("");
  const [nameError, setNameError] = useState("");
  const [selectedTabs, setSelectedTabs] = useState([]);

  const handleControllerSelect = (value) => {
    setSelectedValue(value);
    setFormData((prevData) => ({ ...prevData, processorType: value }));

    const foundController = allControllers.find(
      (controller) => controller.value === value
    );

    if (foundController.ChasisAvl) {
      console.log("Chassis Available: Yes", foundController);
      let value1 = value.split(" ")[0].toString();
      console.log( value1);
      // Determine the number of slots based on chassis type
      
      if (value1 === "1756-A4") {
        slotOptions = [0, 1, 2, 3];
      } else if (value1 === "1756-A7") {
        slotOptions = [0, 1, 2, 3, 4, 5, 6];
      } else if (value1 === "1756-A10") {
        formData.slotOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      } // Add similar conditions for other chassis types

      setFormData((prevData) => ({ ...prevData, slotOptions }));
      setSelectedTabs(["Chassis", "Slot"]); // Show both "Chassis" and "Slot" tabs
    } else {
      console.log("Chassis Available: No");
      setFormData((prevData) => ({ ...prevData, slotOptions: [] }));
      setSelectedTabs(["null"]); // Show "null" when chassis is not available
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "projectName") {
      const formattedValue = value.replace(/ /g, "_");
      if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formattedValue) || value === "") {
        setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setNameError("");
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = moment();
    const formattedDate = currentDate.format("ddd MMM D HH:mm:ss YYYY");

    const NewProjectObject = {
      TargetName: formData.projectName,
      Name: formData.projectName,
      ProcessorTypeSelected: formData.processorType,
      slotNo: formData.slotNo,
      SoftwareRevision: parseFloat(formData.softwareVersion)
        .toFixed(2)
        .toString(),
      MajorRev: Math.floor(formData.softwareVersion).toString(),
      Major: Math.floor(formData.softwareVersion).toString(),
      ProjectCreationDate: formattedDate,
      ExportDate: formattedDate,
      LastModifiedDate: formattedDate,
      Chassis: formData.chassis,
      Slot: formData.slot,
    };

    const foundController = allControllers.find(
      (controller) => controller.value === formData.processorType
    );

    if (foundController) {
      const NewProjectFinalObject = {
        ...NewProjectObject,
        ...foundController,
        
      };

      try {
        const currentDate = moment();
        const formattedDate = currentDate.format("ddd MMM D HH:mm:ss YYYY");

        // const Response = await submitFormData(NewProjectFinalObject);
        // console.log("Server Response:", Response);
      } catch (error) {
        console.error("Error submitting form:", error.message);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      projectName: "",
      processorType: "",
      slotNo: "",
      softwareVersion: "36",
      chassis: "",
      slotOptions: [], // Reset slotOptions
    });
    setNameError("");
  };

  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="projectName" className="form-label">
                  Name of Project
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                />
              </div>
              {nameError && (
                <p style={{ color: "red" }}>
                  <ExclamationCircleOutlined /> {nameError}
                </p>
              )}
              <div className="mb-3">
                {formData.projectName &&
                  (!formData.projectName.includes("_") ||
                    /^[a-zA-Z0-9]+$/.test(
                      formData.projectName.split("_")[1]
                    )) && (
                    <NewProjectModel
                      controllerSelect={handleControllerSelect}
                    />
                  )}
              </div>
              <div className="mb-3">
                <label htmlFor="processorType" className="form-label">
                  Processor Type
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="processorType"
                  name="processorType"
                  value={formData.processorType}
                  onChange={handleChange}
                  disabled
                />
              </div>
              {formData.slotNo && (
                <div className="mb-3">
                  <label htmlFor="slotNo" className="form-label">
                    Slot
                  </label>
                  <select
                    className="form-select"
                    id="slotNo"
                    name="slotNo"
                    value={formData.slotNo}
                    onChange={handleChange}
                  >
                    {formData.slotOptions.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="softwareVersion" className="form-label">
                  Software Version
                </label>
                <select
                  className="form-select"
                  id="softwareVersion"
                  name="softwareVersion"
                  value={formData.softwareVersion}
                  onChange={handleChange}
                >
                  <option value="36.00">36</option>
                  <option value="34.01">34</option>
                  <option value="32.02">32</option>
                </select>
              </div>

              {selectedTabs && (
                <div className="mb-3">
                  {selectedTabs.map((tab) => (
                    <div key={tab}>
                      {tab === "Chassis" && (
                        <div>
                          <label htmlFor="chassis" className="form-label">
                            Chassis
                          </label>
                          <select
                            className="form-select"
                            id="chassis"
                            name="chassis"
                            value={formData.chassis}
                            onChange={handleChange}
                          >                                                                                                                                                                                                                                                                                                                                                           
                            {controlLogixChassisTypes.map((chassis) => (
                              <option
                                key={chassis.value}
                                value={chassis.value}
                              >
                                {chassis.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {tab === "Slot" && (
                        <div className="mb-3">
                          <label htmlFor="slotNo" className="form-label">
                            Slot
                          </label>
                          <select
                            className="form-select"
                            id="slotNo"
                            name="slotNo"
                            value={formData.slotNo}
                            onChange={handleChange}
                          >
                            {slotOptions.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-3">
                {!nameError && formData.processorType && (
                  <button type="submit" className="btn btn-primary">
                    Finish
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
