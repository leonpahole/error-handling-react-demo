import { useMutation } from "react-query";
import { AuthService } from "./auth.service";
import { AuthModels } from "./auth.models";

export namespace AuthQueries {
  export const useLogin = () => {
    return useMutation((req: AuthModels.LoginRequest) =>
      AuthService.login(req)
    );
  };
}
