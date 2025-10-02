import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user.role/user.role.guard';
import { ValidRoles } from '../interface/valid-roles';


export const Auth = (...roles: ValidRoles[]) => {
    if (roles.length === 0) {
        return applyDecorators(
            UseGuards(AuthGuard('jwt'))
        );
    }
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard('jwt'), UserRoleGuard)
    )
}