import axios from "axios";
import { AuthModels } from "./auth.models";

export namespace AuthApi {
  export const login = (req: AuthModels.LoginRequest) => {
    return axios.post("/login", req);
  };
}
