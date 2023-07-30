import { AuthModels } from "./auth.models";
import { AuthApi } from "./auth.api";
import { AuthErrors } from "./auth.errors";

export namespace AuthService {
  export const login = async (req: AuthModels.LoginRequest) => {
    try {
      return await AuthApi.login(req);
    } catch (e) {
      // wrap the error into application error and rethrow it
      AuthErrors.Login.rethrowError(e);
    }
  };
}
