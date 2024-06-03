import { sha512 } from "js-sha512";

export function hashPassword(password: string) {
  return sha512(password).toString();
}