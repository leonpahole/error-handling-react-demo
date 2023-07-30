import { AxiosError } from "axios";

export namespace RestUtils {
  export const doesServerErrorMessageContain = (
    e: AxiosError,
    text: string
  ): boolean => {
    const message = extractServerErrorMessage(e);
    if (message == null) {
      return false;
    }

    return message.toLowerCase().includes(text.toLowerCase());
  };

  const extractServerErrorMessage = (e: AxiosError): string | null => {
    if (!e.response) {
      return null;
    }

    const data = e.response.data as { message: unknown } | undefined;

    if (typeof data?.message === "string") {
      return data.message;
    }

    return null;
  };
}
