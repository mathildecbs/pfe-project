import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { Reflector } from "@nestjs/core";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler()
        );
        const isRouteAdmin = this.reflector.get<boolean>(
            'isRouteAdmin',
            context.getHandler()
        );

        console.log("ici", isRouteAdmin);


        if (isPublic) {
            return true;
        } else if (isRouteAdmin) {
            const request = context.switchToHttp().getRequest();
            console.log("c admin");
            return this.validateRequestAdmin(request);
        } else {
            const request = context.switchToHttp().getRequest();
            console.log("c pas admin");
            return this.validateRequest(request);
        }
    }

    private validateRequest(request: Request): boolean {

        console.log("c pas admin2");
        const header = request.headers['authorization'];
        
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
            if (!user) {
                return false;
            }
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private async validateRequestAdmin(request: Request): Promise<boolean> {
        console.log("c admin 2");
        const header = request.headers['authorization'];

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
            const isUserAdmin = await this.userService.is_user_admin(decoded.username);

            console.log("il est admin ? ", isUserAdmin);

            if (!user) {
                return false;
            }
            if (!isUserAdmin) {
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