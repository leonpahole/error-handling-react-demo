import clsx from "clsx";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { FormikTextInput } from "../inputs/TextInput/FormikTextInput";
import "./LoginForm.css";

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password."),
});

export const LoginForm: React.FC = () => (
  <div className="login-form-container">
    <h1 className="login-form-header">Login</h1>
    <Formik<LoginFormValues>
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          // eslint-disable-next-line no-alert
          alert(JSON.stringify(values, null, 2));
          resetForm();
          setSubmitting(false);
        }, 500);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="login-form">
          <FormikTextInput
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email..."
          />

          <FormikTextInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password..."
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx("login-form-submit-button", {
              "is-submitting": isSubmitting,
            })}
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);
