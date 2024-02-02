const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { parseString } = require("xml2js");
const fs = require("fs");

const router = express.Router();

let TargetName = null;
let AOIchildrenData = null;
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
        TargetName = rsLogix5000Content.$.TargetName;
        //console.log(TargetName)
        const controllerChildren = Object.keys(
          rsLogix5000Content.Controller
        ).filter((key) => key !== "$");

        ///////////////////AOI////////////////////////////////////

        const addOnInstructionDefinitionsNode =
          rsLogix5000Content.Controller.AddOnInstructionDefinitions;

        let encodedData = null; // Declare encodedData outside the if block
        let childrenData = null; // Declare childrenData outside the if block
        let encodedDataNode = null;
        let encodeddataDetails = null;

        if (addOnInstructionDefinitionsNode) {
          //console.log("addOnInstructionDefinitionsNode found");

          encodedDataNode = addOnInstructionDefinitionsNode.EncodedData;
          const addOnInstructionDefinitionsArray =
            addOnInstructionDefinitionsNode.AddOnInstructionDefinition || [];

          // Process the EncodedData
          //console.log(encodedDataNode);
          if (encodedDataNode) {
            encodedData = {
              encodedType: encodedDataNode.$.EncodedType,
              name: encodedDataNode.$.Name,
              revision: encodedDataNode.$.Revision,
              vendor: encodedDataNode.$.Vendor,
              editedDate: encodedDataNode.$.EditedDate,
              softwareRevision: encodedDataNode.$.SoftwareRevision,
              // encryptionConfig: encodedDataNode.$.EncryptionConfig,
              // Add other properties as needed
            };

            for (const key in encodedDataNode.$) {
              // Skip properties that have already been added and the special '_' property
              if (
                key !== "_" &&
                key !== "EncryptionConfig" &&
                !encodedData.hasOwnProperty(key)
              ) {
                encodedData[key] = encodedDataNode.$[key];
              }
            }

            //  for (const key in encodedDataNode) {
            //     if (key !== '$' && key !== '_') {
            //       if (key === 'Parameters' && encodedDataNode[key].Parameter) {
            //         // Save parameters as an array
            //         encodedData[key.toLowerCase()] = encodedDataNode[key].Parameter.map(param => param.$);
            //       } else {
            //         encodedData[key.toLowerCase()] = encodedDataNode[key];
            //       }
            //     }
            //   }

            //console.log("encoderdata", encodedData);
          }

          // Process the AddOnInstructionDefinitions
          // Assuming addOnInstructionDefinitionsArray is your array of data
          childrenData = addOnInstructionDefinitionsArray.map(
            (addOnInstructionDefinition) => ({
              name: addOnInstructionDefinition.$.Name,
            })
          );

          //console.log("childrenData", childrenData);
          AOIchildrenData = addOnInstructionDefinitionsArray.map((addOnInstructionDefinition) => {
            let data = {
              name: addOnInstructionDefinition.$.Name,
              // Add other properties as needed
            };
          
            // Iterate over properties in addOnInstructionDefinition.$ and add them to data
            for (const key in addOnInstructionDefinition.$) {
              // Skip properties that have already been added and the special '_' property
              if (key !== '_' && !data.hasOwnProperty(key)) {
                data[key] = addOnInstructionDefinition.$[key];
              }
            }
          
            // Iterate over child nodes and add them to data
            for (const key in addOnInstructionDefinition) {
              if (key !== '$' && key !== '_') {
                if (key === 'Parameters' && addOnInstructionDefinition[key].Parameter) {
                  // Save parameters as an array of objects
                  data[key.toLowerCase()] = addOnInstructionDefinition[key].Parameter.map(paramNode => {
                    let paramData = {};
          
                    // Iterate over properties in each Parameter node
                    for (const paramKey in paramNode.$) {
                      if (paramKey !== '_') {
                        paramData[paramKey.toLowerCase()] = paramNode.$[paramKey];
                      }
                    }
          
                    // Iterate over child nodes in each Parameter node
                    for (const paramChildKey in paramNode) {
                      if (paramChildKey !== '$') {
                        paramData[paramChildKey.toLowerCase()] = paramNode[paramChildKey];
                      }
                    }
          
                    return paramData;
                  });
                } else {
                  data[key.toLowerCase()] = addOnInstructionDefinition[key];
                }
              }
            }
          
            return data;
          });
          
          //console.log("All AOI CHILD", AOIchildrenData);
          //console.log("AOIchildrenData", JSON.stringify(AOIchildrenData, null, 2));

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
            priority: task.$.Priority,
            watchdog: task.$.Watchdog,
            description: task.Description ? task.Description.trim() : "", // Add description field
            children: task.ScheduledPrograms
              ? Array.isArray(task.ScheduledPrograms.ScheduledProgram)
                ? task.ScheduledPrograms.ScheduledProgram.map((program) => ({
                    title: program.$.Name,
                    key: program.$.Name,
                  }))
                : [
                    {
                      title: task.ScheduledPrograms.ScheduledProgram.$.Name,
                      key: task.ScheduledPrograms.ScheduledProgram.$.Name,
                    },
                  ]
              : [],
          })),
        };

        if (tasksIndex !== -1) {
          controllerChildren.splice(tasksIndex, 1, tasksNode);
        }

        res.json({
          TargetName: rsLogix5000Content.$.TargetName,
          RSLogix5000Content: {
            Controller: controllerChildren,
          },
          AOIData: AOIchildrenData,
        });
      }
    });
  });
});

module.exports = router;
