import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import { UserService } from "./user.service";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        return this.validateRequest(request);
    }

    private validateRequest(request: Request): boolean {
        const header = request.headers['Authorization'];
        
        if (!header) {
            return false;
        }

        const token = header.split(' ')[1];
        if (!token) {
            return false;
        }

        try {
            const secretKey = this.configService.get<string>('JWT_SECRET');
            const decoded = this.jwtService.verify(token, {secret: secretKey});

            const user = this.userService.findOne(decoded.username);
            const isAdmin = decoded.isAdmin;
            if (!user || !isAdmin) {
                return false;
            }
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}

// une activation pour acceder à des trucs quand il est co, donc il récupère dans le header, il voit s'il y a bine le token
// voir u admin a le droit à quoi, et à ce moment là, je le laisse passer pour juste ce à quoi il a le droit

//creer un admin guard