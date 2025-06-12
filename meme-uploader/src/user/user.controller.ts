import { Body, Controller,Post } from '@nestjs/common';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
    
    constructor(private userService: UserService) {}

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
        return this.userService.create(body.email, body.password);
    }

}
