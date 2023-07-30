import { ErrorHandler } from "../shared/error-handling";
import axios from "axios";
import { RestUtils } from "../rest/rest.utils";

export namespace AuthErrors {
  // define what all can go wrong during login; but without general errors, which are already handled in the error handler
  type LoginErrorCodes =
    | "INVALID_CREDENTIALS"
    | "USER_NOT_ACTIVATED"
    | "USER_DOESNT_EXIST";

  // implement checking for each of the errors
  export const Login = new ErrorHandler<LoginErrorCodes>([
    {
      code: "INVALID_CREDENTIALS",
      condition: (e) => {
        if (axios.isAxiosError(e)) {
          return e.response?.status === 403;
        }

        return false;
      },
    },
    {
      code: "USER_DOESNT_EXIST",
      condition: (e) => {
        if (axios.isAxiosError(e)) {
          return RestUtils.doesServerErrorMessageContain(
            e,
            "User does not exist!"
          );
        }

        return false;
      },
    },
    {
      code: "USER_NOT_ACTIVATED",
      condition: (e) => {
        if (axios.isAxiosError(e)) {
          return RestUtils.doesServerErrorMessageContain(
            e,
            "User is not activated!"
          );
        }

        return false;
      },
    },
  ]);
}
