import clsx from "clsx";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { FormikTextInput } from "../inputs/TextInput/FormikTextInput";
import "./LoginForm.css";
import { AuthModels } from "../../util/auth/auth.models";
import { AuthQueries } from "../../util/auth/auth.queries";
import { AuthErrors } from "../../util/auth/auth.errors";

type LoginFormValues = AuthModels.LoginRequest;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password."),
});

export const LoginForm: React.FC = () => {
  const useLogin = AuthQueries.useLogin();

  const errorType = AuthErrors.Login.getErrorCode(useLogin.error);

  return (
    <div className="login-form-container">
      <h1 className="login-form-header">Login (improved error handling)</h1>
      <p>
        Use the following emails to simulate states: unactivated@test.com,
        nonexisting@test.com, invalidCredentials@test.com, internal@test.com,
        unknown@test.com, success@test.com.
      </p>

      <Formik<LoginFormValues>
        initialValues={{
          email: "unactivated@test.com",
          password: "test",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setSubmitting, resetForm }) => {
          try {
            await useLogin.mutateAsync(values);
            resetForm();
            alert("Login successful!");
          } catch (e) {
            const error = AuthErrors.Login.getErrorCode(e);

            if (error === "USER_NOT_ACTIVATED") {
              setErrors({ email: "User is not activated!" });
            } else if (error === "USER_DOESNT_EXIST") {
              setErrors({ email: "User doesn't exist!" });
            } else if (error === "UNKNOWN_ERROR") {
              alert("An unknown error occurred!");
            }
          } finally {
            setSubmitting(false);
          }
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

            {errorType === "INVALID_CREDENTIALS" && (
              <p className="login-form-error-message">
                Invalid credentials! Please try again!
              </p>
            )}

            {errorType === "NETWORK_ERROR" && (
              <p className="login-form-error-message">
                A network error occurred! Are you connected to the internet?
              </p>
            )}

            {errorType === "INTERNAL_ERROR" && (
              <p className="login-form-error-message">
                An internal error occurred! Please try again later or check the
                status of the service on the <a>status page</a>.
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
