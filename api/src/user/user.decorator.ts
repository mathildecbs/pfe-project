import { Reflector } from "@nestjs/core";

export const User = Reflector.createDecorator<string[]>();