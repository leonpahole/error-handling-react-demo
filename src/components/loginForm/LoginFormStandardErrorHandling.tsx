import clsx from "clsx";
import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { FormikTextInput } from "../inputs/TextInput/FormikTextInput";
import "./LoginForm.css";
import { AuthModels } from "../../util/auth/auth.models";
import { AxiosError } from "axios";
import { RestUtils } from "../../util/rest/rest.utils";
import { AuthQueries } from "../../util/auth/auth-standard-error-handling.queries";

type LoginFormValues = AuthModels.LoginRequest;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Please enter your email."),
  password: Yup.string().required("Please enter your password."),
});

type LoginError = "invalidCredentials" | "internal" | "network";

export const LoginForm: React.FC = () => {
  const useLogin = AuthQueries.useLogin();
  const [errorType, setErrorType] = React.useState<LoginError | null>(null);

  return (
    <div className="login-form-container">
      <h1 className="login-form-header">Login (standard error handling)</h1>
      <p>
        Use the following emails to simulate states: unactivated@test.com,
        nonexisting@test.com, invalidCredentials@test.com, internal@test.com,
        unknown@test.com, success@test.com.
      </p>

      <Formik<LoginFormValues>
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors, setSubmitting, resetForm }) => {
          try {
            await useLogin.mutateAsync(values);
            setErrorType(null);
            resetForm();
            alert("Login successful!");
          } catch (e) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
              // 401 can mean multiple errors - check which error it is
              const isNotActivated = RestUtils.doesServerErrorMessageContain(
                error,
                "User is not activated!"
              );

              if (isNotActivated) {
                setErrors({ email: "User is not activated!" });
                return;
              }

              const isNonExisting = RestUtils.doesServerErrorMessageContain(
                error,
                "User does not exist!"
              );

              if (isNonExisting) {
                setErrors({ email: "User doesn't exist!" });
                return;
              }
            } else if (error.response?.status === 403) {
              setErrorType("invalidCredentials");
            } else if (error.response?.status === 500) {
              setErrorType("internal");
            } else if (error.code === "ERR_NETWORK") {
              setErrorType("network");
            } else {
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

            {errorType === "invalidCredentials" && (
              <p className="login-form-error-message">
                Invalid credentials! Please try again!
              </p>
            )}

            {errorType === "network" && (
              <p className="login-form-error-message">
                A network error occurred! Are you connected to the internet?
              </p>
            )}

            {errorType === "internal" && (
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
