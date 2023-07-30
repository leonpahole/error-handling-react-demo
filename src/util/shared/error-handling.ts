import axios from "axios";

// codes that we want to handle in every scenario
export type GeneralErrorCodes =
  | "NETWORK_ERROR"
  | "INTERNAL_ERROR"
  | "UNKNOWN_ERROR";

class ApplicationException<CodeT> extends Error {
  public code: CodeT;

  constructor(code: CodeT) {
    super(code as string);
    this.code = code;
  }
}

interface ErrorEntry<CodeT> {
  code: CodeT;
  condition: (error: unknown) => boolean;
}

export class ErrorHandler<CodeT extends string> {
  entries: ErrorEntry<CodeT | GeneralErrorCodes>[] = [];

  constructor(entries: ErrorEntry<CodeT>[]) {
    type ICodeT = CodeT | GeneralErrorCodes;

    // implement checking for each of the general errors

    const internalError: ErrorEntry<ICodeT> = {
      code: "INTERNAL_ERROR",
      condition: (e) => {
        if (axios.isAxiosError(e)) {
          return (
            e.response?.status != null &&
            e.response.status >= 500 &&
            e.response.status < 600
          );
        }

        return false;
      },
    };

    const networkError: ErrorEntry<ICodeT> = {
      code: "NETWORK_ERROR",
      condition: (e) => {
        if (axios.isAxiosError(e)) {
          return e.code === "ERR_NETWORK";
        }

        return false;
      },
    };

    const unknownError: ErrorEntry<ICodeT> = {
      code: "UNKNOWN_ERROR",
      condition: () => true,
    };

    // general errors have the lowest priority
    this.entries = [...entries, internalError, networkError, unknownError];
  }

  // convert the error into an application exception
  public rethrowError(
    error: unknown
  ): ApplicationException<CodeT | GeneralErrorCodes> {
    console.error(error);
    const errorEntry = this.entries.find((entry) =>
      entry.condition(error ?? {})
    );
    const { code } = errorEntry!;
    throw new ApplicationException(code);
  }

  public getErrorCode(error: unknown): CodeT | GeneralErrorCodes | null {
    console.log(error);
    if (error instanceof ApplicationException) {
      return error.code;
    }

    return null;
  }
}

// can be used for endpoints that only need general error handling
export const SharedErrorHandler = new ErrorHandler<never>([]);
