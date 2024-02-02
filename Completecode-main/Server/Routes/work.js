const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { parseString } = require("xml2js");
const fs = require("fs");

const router = express.Router();

// Define a route to get the XML tree structure
router.get("/getXmlTree", (req, res) => {
  // Read XML content from the file
  const xmlFilePath = "D:\\P2_Lorem_l5x\\Completecode\\V103_GC1.L5X";

  fs.readFile(xmlFilePath, "utf-8", (err, xmlContent) => {
    if (err) {
      console.error("Error reading XML file:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    parseString(xmlContent, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const rsLogix5000Content = result.RSLogix5000Content;
        const controllerChildren = Object.keys(
          rsLogix5000Content.Controller
        ).filter((key) => key !== "$");

        const addOnInstructionDefinitionsNode =
          rsLogix5000Content.Controller.AddOnInstructionDefinitions;

        let encodedData = null; // Declare encodedData outside the if block
        let childrenData = null; // Declare childrenData outside the if block
        let encodedDataNode = null;
        if (addOnInstructionDefinitionsNode) {
          //console.log("addOnInstructionDefinitionsNode found");

          encodedDataNode = addOnInstructionDefinitionsNode.EncodedData;
          const addOnInstructionDefinitionsArray =
            addOnInstructionDefinitionsNode.AddOnInstructionDefinition || [];

          // Process the EncodedData
          if (encodedDataNode) {
            encodedData = {
              encodedType: encodedDataNode.$.EncodedType,
              name: encodedDataNode.$.Name,
              revision: encodedDataNode.$.Revision,
              vendor: encodedDataNode.$.Vendor,
              editedDate: encodedDataNode.$.EditedDate,
              softwareRevision: encodedDataNode.$.SoftwareRevision,
              encryptionConfig: encodedDataNode.$.EncryptionConfig,
              // Add other properties as needed
            };
          }

          // Process the AddOnInstructionDefinitions
          childrenData = addOnInstructionDefinitionsArray.map(
            (addOnInstructionDefinition) => ({
              name: addOnInstructionDefinition.$.Name,
            })
          );

          // console.log(encodedData);
        } else {
          // console.log("addOnInstructionDefinitionsNode or EncodedData not found");
        }

        const AOIIndex = controllerChildren.indexOf(
          "AddOnInstructionDefinitions"
        );

        if (AOIIndex !== -1) {
          const AOINode = {
            title: "AddOnInstructionDefinitions",
            key: "AddOnInstructionDefinitionsKey", // Add a unique key here
            children: [
              // Merged content for EncodedData and AddOnInstructionDefinition
              ...(Array.isArray(encodedData)
                ? encodedData.map((data, index) => ({
                    title: data.name || `EncodedData-${index + 1}`,
                    key: `EncodedDataKey-${index + 1}`,
                    encodedType: data.encodedType || null,
                    ...data,
                  }))
                : [
                    {
                      title: encodedDataNode.$.Name || "EncodedData-1",
                      key: "EncodedDataKey-1",
                      ...encodedDataNode,
                    },
                  ]),
              ...(Array.isArray(childrenData)
                ? childrenData.map((data, index) => ({
                    title: data.name,
                    key: `AddOnInstructionDefinitionKey-${index + 1}`,
                    encodedType: data.encodedType || null,
                    ...data,
                  }))
                : [childrenData]),
            ],
          };
          controllerChildren.splice(AOIIndex, 1, AOINode);
        }

        // Check if 'Tasks' exists in the RSLogix5000Content
        const tasksIndex = controllerChildren.indexOf("Tasks");

        // Extract the 'Tasks' array directly from the XML result
        const tasks = rsLogix5000Content.Controller.Tasks.Task || [];

        const tasksNode = {
          title: "Tasks",
          key: "Tasks",
          children: tasks.map((task) => ({
            title: task.$.Name,
            key: task.$.Name,
            type: task.$.Type,
            rate: task.$.Rate,
            // Add other properties as needed
          })),
        };

        if (tasksIndex !== -1) {
          controllerChildren.splice(tasksIndex, 1, tasksNode);
        }

        res.json({
          RSLogix5000Content: {
            Controller: controllerChildren,
          },
        });
      }
    });
  });
});

module.exports = router;
