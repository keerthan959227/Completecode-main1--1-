import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Loginuser } from "../../api/users";
import { message } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    //console.log(values);
    try {
      const response = await Loginuser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);

        window.location.href = "/";
      } else {
        message.error(response.message);
      }

    } catch (error) {
      message.error(error.message);     
    }
  };
 
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, and one number"
        ),
    }),
    onSubmit: handleSubmit,
  });
   
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
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
                    <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                    <p className="text-white-50 mb-5">
                      Please enter your login and password!
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
 
                    <div className="small mb-5 pb-lg-2">
                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                    <div className="text-white register-link">
                    Forgot Password <span style={{ fontFamily: 'your-chosen-font', fontSize: 'your-font-size' }}>?</span>
                    </div>
                  </Link>
                    </div>
                   
 
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
 
                <div>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                    <div className="text-white register-link">
                    Don't have an Account? <span style={{ fontFamily: 'your-chosen-font', fontSize: 'your-font-size' }}>Register</span>
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
 
export default Login;