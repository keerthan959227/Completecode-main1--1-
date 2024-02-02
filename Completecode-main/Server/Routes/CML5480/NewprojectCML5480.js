const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const authMiddleware = require("../../middleware/authMiddleware");
const {
  findUserByuserId,
  addUserfile,
} = require("../../mssql"); // Adjust the path based on your file structure

router.post("/", authMiddleware, async (req, res) => {
  try {
    const formData = req.body;
    const user = await findUserByuserId(req.body.userId); // Assuming findUserByuserId can also find by ID
    const userEmail = user.email;

    // Original XML file path
    const originalFilePath =
      "D:\\P2_Lorem_l5x\\Completecode\\Server\\L5X_format\\CL5480\\CL5480.L5X";

    // Read the original XML file
    const xmlData = fs.readFileSync(originalFilePath, "utf8");

    // Parse the XML data
    const parser = new xml2js.Parser();
    parser.parseString(xmlData, async (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Update RSLogix5000Content attributes with values from formData
      if (formData.SoftwareRevision) {
        result.RSLogix5000Content.$.SoftwareRevision =
          formData.SoftwareRevision;
      }

      if (formData.TargetName) {
        result.RSLogix5000Content.$.TargetName = formData.TargetName;
      }

      if (formData.ExportDate) {
        result.RSLogix5000Content.$.ExportDate = formData.ExportDate;
      }

      // Update Controller attributes with values from formData
      const controllerAttributes = result.RSLogix5000Content.Controller[0].$;
      if (formData.Name) {
        controllerAttributes.Name = formData.Name;
      }

      if (formData.ProcessorType) {
        controllerAttributes.ProcessorType = formData.ProcessorType;
      }

      if (formData.MajorRev) {
        controllerAttributes.MajorRev = formData.MajorRev;
      }

      if (formData.ProjectCreationDate) {
        controllerAttributes.ProjectCreationDate = formData.ProjectCreationDate;
      }

      if (formData.LastModifiedDate) {
        controllerAttributes.LastModifiedDate = formData.LastModifiedDate;
      }

      // Update Module attributes with values from formData
      const moduleAttributes =
        result.RSLogix5000Content.Controller[0].Modules[0].Module[0].$;
      if (formData.CatalogNumber) {
        moduleAttributes.CatalogNumber = formData.CatalogNumber;
      }

      if (formData.ProductCode) {
        moduleAttributes.ProductCode = formData.ProductCode;
      }

      if (formData.Major) {
        moduleAttributes.Major = formData.Major;
      }

      // Use xml2js.Builder to convert the modified result back to XML
      const builder = new xml2js.Builder();
      const xmlOutput = builder.buildObject(result);

      // Save the XML output as a string
      const resultString = xmlOutput;

      // New folder path
      const userFolderPath = path.join("D:\\SERVERFILES", userEmail);
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath);
      }

      // New XML file path within the user's folder
      const newFilePath = path.join(
        userFolderPath,
        `${formData.Name || "DefaultFileName"}.L5X`
      );

      // Save the modified XML to a new file
      fs.writeFileSync(newFilePath, resultString, "utf8");
      console.log("Modified XML file saved:", newFilePath);

      try {
        // Save the file path to Microsoft SQL Server
        const uploadfile = await addUserfile({
          userId: formData.userId,
          filename: formData.Name || "DefaultFileName",
          timestamp: new Date(),
          fileContent: newFilePath, // Save the file path instead of JSON string
        });

        if (!uploadfile) {
          return res.send({
            success: false,
            message: "User File not Added",
          });
        }

        // Send a response back to the client
        res.send({
          success: true,
          message: "User Files successfully",
        });
      } catch (error) {
        console.error("Error adding user file to the database:", error);
        res.status(500).send("Internal Server Error");
      }
    });
  } catch (error) {
    console.error("Error processing the form data:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
