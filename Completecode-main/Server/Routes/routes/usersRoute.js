const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  findUserByEmail,
  addUser,
  findUserByuserId,
  addUserfile,
  getUserFilesByUserId,
  getFilePathByFileId,
} = require("../../mssql"); // Adjust the path based on your file structure
const getFileTree =  require("./fileProcess")
const authMiddleware = require("../../middleware/authMiddleware");
const express = require("express");
const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const fsPromises = require("fs").promises;


// Login
router.post("/login", async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);

    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist",
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }
    console.log("token", user.userId);
    // Generate token
    const token = jwt.sign({ _id: user.userId }, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Register
router.post("/register", async (req, res) => {
  
  try {
    const user = await findUserByEmail(req.body.email);

    if (user) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user object with email, password, and name
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    };

    const addedUser = await addUser(newUser);

    if (addedUser) {
      return res.send({
        success: true,
        message: "User registered successfully",
      });
    } else {
      return res.send({
        success: false,
        message: "Failed to register user",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Protected route
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    //console.log("at getuser",req.body);

    const user = await findUserByuserId(req.body.userId); // Assuming findUserByEmail can also find by ID

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // Remove the password from the user object before sending the response
    const userWithoutPassword = { ...user._doc, password: undefined };

    res.send({
      success: true,
      message: "User details fetched successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/getfile", authMiddleware, async (req, res) => {
  try {
    const formData = req.body;

    const files = await getUserFilesByUserId(formData.userId);

    // Mapping the results and formatting timestamp
    const fileInformation = await Promise.all(files.map(async (file) => {
      try {
        const filetree = await getFileTree(file.FileContent);
        return {
          fileId: file.FileId,
          filename: file.Filename,
          filetime: file.Timestamp.toISOString(),
          filetree: filetree,
        };
      } catch (error) {
        console.error(`Error processing file ${file.FileContent}:`, error);
        return {
          fileId: file.FileId,
          filename: file.Filename,
          filetime: file.Timestamp.toISOString(),
          filetree: null,
        };
      }
    }));

    // const fileInformationtree = await Promise.all(files.map(async (file) => {
    //   try {
    //     const result = await getFileTree(file.FileContent);
    //     return {
    //       FileContent: file.FileContent,
    //       Result: result,
    //     };
    //   } catch (error) {
    //     console.error(`Error processing file ${file.FileContent}:`, error);
    //     return {
    //       File: file.FileContent,
    //       Result: null,
    //     };
    //   }
    // }));
    
    // console.log("File Information with Tree:", fileInformationtree);
    

    // const singleFile = {
    //   FileContent: "D:\\SERVERFILES\\guest@gmail.com\\deep.L5X",
    // };
    
    // try {
    //   const result = await getFileTree(singleFile.FileContent);
    //   console.log("Result:", result); // Log the result to check the output
    // } catch (error) {
    //   console.error("Error processing file:", error);
    // }



    if (files.length > 0) {
      res.json({
        success: true,
        message: "User details fetched successfully",
        data: fileInformation,
      });
    } else {
      res.json({
        success: false,
        message: "No files found for the user",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error processing the form data:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Your existing code for fetching file information

// Add a new endpoint for downloading files
// Assuming you have the necessary imports and setup for Express

router.get("/downloadFile/:fileId", authMiddleware, async (req, res) => {
  console.log("at download")
  try {
    const { fileId } = req.params;

    // Fetch the file path based on fileId (replace with your actual logic)
    const filePath = await getFilePathByFileId(fileId);

    if (filePath) {
      // Set appropriate headers for file download
      const fileName = filePath.split('\\').pop(); // Extract filename from the path
      res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-type', 'application/octet-stream');

      // Send the file content as a response
      res.sendFile(filePath);
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Internal Server Error');
  }
});





module.exports = router;
