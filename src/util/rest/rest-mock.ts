import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { AuthModels } from "../auth/auth.models";

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios, { delayResponse: 1000 });

// mock post request to /login
mock.onPost("/login").reply((config) => {
  const data: AuthModels.LoginRequest = JSON.parse(config.data);
  if (data.email.startsWith("unactivated")) {
    return [401, { message: "User is not activated!" }];
  }

  if (data.email.startsWith("nonexisting")) {
    return [401, { message: "User does not exist!" }];
  }

  if (data.email.startsWith("invalidCredentials")) {
    return [403, { message: "Invalid credentials!" }];
  }

  if (data.email.startsWith("internal")) {
    return [500, { message: "An error has occured on the server!" }];
  }

  if (data.email.startsWith("unknown")) {
    return [407, { message: "Some random error" }];
  }

  return [200, {}];
});
