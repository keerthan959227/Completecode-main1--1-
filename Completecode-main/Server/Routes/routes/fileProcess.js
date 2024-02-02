const fsPromises = require("fs").promises;
const { parseString } = require("xml2js");

const getFileTree = async (filePath) => {
  try {
    const xmlContent = await fsPromises.readFile(filePath, "utf-8");

    // Parse the XML content
    const result = await new Promise((resolve, reject) => {
      parseString(xmlContent, { explicitArray: false }, (err, parsedResult) => {
        if (err) {
          console.error("Error parsing XML:", err);
          reject(err);
        } else {
          resolve(parsedResult);
        }
      });
    });

    // Extract relevant data
    const rsLogix5000Content = result.RSLogix5000Content;
    const TargetName = rsLogix5000Content.$.TargetName;
    const controllerChildren = Object.keys(rsLogix5000Content.Controller)
      .filter((key) => key !== "$");

    // Return the desired structure
    return {
      TargetName: TargetName,
      RSLogix5000Content: {
        Controller: controllerChildren,
      },
    };
  } catch (error) {
    console.error("Error reading or parsing XML file:", error);
    throw error; // Rethrow the error to be caught by the calling function
  }
};

module.exports = getFileTree; // Export the function for use in other files
