import { Axios, AxiosError } from "axios";
import { isRouteErrorResponse } from "react-router-dom";
import { toast } from "react-toastify";

export default abstract class ErrorUtils {
  private constructor() {}

  static toString(error: unknown): string {
    if (isRouteErrorResponse(error)) {
      const typedError = error as { error?: { message: string } };
      return typedError.error?.message || error.statusText;
    }
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }

    console.log(error);
    return "No error description available";
  }

  static buildHintErrorMessage(error: unknown): null | string {
    if (typeof error === "string") {
      return error;
    }
    const message: null | string = error instanceof AxiosError ? error.response?.data?.error : null;
    return message?.startsWith("Route not found") ? null : message
  }
}
