import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
         constructor(private readonly authService : AuthService) {}


@UseGuards(AuthGuard('google'))
  @Post('auth/login')
  async login(@Req() req) {
    return req.user;
}
  @Get()
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req()req) {}

  @Get("auth/google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req()req) {
    return this.authService.googleLogin(req);
  }
}
