import axios from './index';


export const submitFormData = async (payload) => {
  try {
    // const response = await axios.post(
    //   `${serverBaseUrl}/newprojectCML5480`,
    //   formData
    // );

    const response = await axios.post("/newprojectCML5480",payload);
    
    return response.data;
  } catch (error) {
    // Handle the error (e.g., log it or display a user-friendly message)
    console.error("Error submitting form data:", error);
    throw error; // Re-throw the error if you want to handle it in the calling code
  }
};

