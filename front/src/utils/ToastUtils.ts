import { toast } from "react-toastify";
import ErrorUtils from "./ErrorUtils";

export default abstract class ToastUtils {
  private constructor() {}

  static error(error: unknown, prefix?: string) {
    if (error instanceof Error) {
      console.error(error);
    }
    const errorMessage = ErrorUtils.buildHintErrorMessage(error);
    const message = [prefix, errorMessage].filter((message) => message).join("\n");
    toast.error(message);
  }

  static success(message: string) {
    toast.success(message);
  }
}