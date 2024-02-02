import axios from "./index";

//login
export const Loginuser = async (payload) => {
  try {
    const response = await axios.post("/users/login", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//register

export const Registeruser = async (payload) => {
  
  try {
    const response = await axios.post("/users/register", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//get user protected
export const GetCurrentuser = async () => {
  try {
    const response = await axios.get("/users/get-current-user");

    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const getFileData = async () => {
  try {
    const response = await axios.get("users/getfile");

    return response.data;
  } catch (error) {
    // Handle the error (e.g., log it or display a user-friendly message)
    console.error("Error submitting form data:", error);
    throw error; // Re-throw the error if you want to handle it in the calling code
  }
};

export const downloadFile = async (fileId) => {
  try {
    const response = await axios.get(`users/downloadFile/${fileId}`, {
      responseType: 'blob',  // Specify responseType as 'blob'
    });

    return response.data;  // Return the response data directly
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};



