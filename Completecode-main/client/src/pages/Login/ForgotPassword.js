import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./login.css";
import { Link } from "react-router-dom";
 
const ForgotPassword = () => {
 
  const handleSubmit = async (values) => {
    console.log(values);
   
    try {
     
 
    } catch (error) {
 
 
     
    }
  };
 
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      forgotPassword: false, // New field for handling "Forgot Password"
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: handleSubmit,
  });
 
 
 
 
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-md-5 mt-md-4 pb-5">
                    <h2 className="fw-bold mb-2 text-uppercase"></h2>
                    <p className="text-white-50 mb-5">
           
                    </p>
 
                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        id="typeEmailX"
                        className={`form-control form-control-lg ${
                          formik.errors.email && formik.touched.email
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Email"
                        {...formik.getFieldProps("email")}
                      />
                      {formik.errors.email && formik.touched.email && (
                        <div className="invalid-feedback">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
 
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
 
                <div>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <div className="text-white register-link">
                    <span style={{ fontFamily: 'your-chosen-font', fontSize: 'your-font-size' }}></span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
 
export default ForgotPassword;