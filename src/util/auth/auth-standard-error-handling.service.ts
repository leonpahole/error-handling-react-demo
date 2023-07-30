import { AuthModels } from "./auth.models";
import { AuthApi } from "./auth.api";

export namespace AuthService {
  export const login = (req: AuthModels.LoginRequest) => {
    return AuthApi.login(req);
  };
}
