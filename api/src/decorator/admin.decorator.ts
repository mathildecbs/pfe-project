import { SetMetadata } from '@nestjs/common';
export const IsRouteAdmin = () => SetMetadata('isRouteAdmin', true);
