import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
 
const Register = () => {
  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log(values);
  };
 
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
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
                    <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                    <p className="text-white-50 mb-5">
                      Please enter your details
                    </p>
 
                    {/* Name Field */}
                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        id="typeName"
                        className={`form-control form-control-lg ${
                          formik.errors.name && formik.touched.name
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Name"
                        {...formik.getFieldProps("name")}
                      />
                      {formik.errors.name && formik.touched.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </div>
 
                    {/* Email Field */}
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
 
                    {/* Password Field */}
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typePasswordX"
                        className={`form-control form-control-lg ${
                          formik.errors.password && formik.touched.password
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Password"
                        {...formik.getFieldProps("password")}
                      />
                      {formik.errors.password && formik.touched.password && (
                        <div className="invalid-feedback">
                          {formik.errors.password}
                        </div>
                      )}
                    </div>
 
                    {/* Confirm Password Field */}
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typeConfirmPassword"
                        className={`form-control form-control-lg ${
                          formik.errors.confirmPassword &&
                          formik.touched.confirmPassword
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Confirm Password"
                        {...formik.getFieldProps("confirmPassword")}
                      />
                      {formik.errors.confirmPassword &&
                        formik.touched.confirmPassword && (
                          <div className="invalid-feedback">
                            {formik.errors.confirmPassword}
                          </div>
                        )}
                    </div>
 
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Register
                    </button>
                  </div>
                </form>
 
                <div>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                   <div className="text-white">
                  Already have an account? <span style={{ fontFamily: 'your-chosen-font', fontSize: 'your-chosen-size', fontWeight: 'your-chosen-weight' }}>Login</span>
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
 
export default Register;