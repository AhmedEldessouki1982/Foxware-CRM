import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { AuthRepository } from './auth.repository';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/authResponse.dto';
import { PasswordService } from './utils/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  //Delete a user by Id
  async deleteUser(id: string) {
    const user = await this.authRepository.findById(id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.authRepository.delete(id);
  }

  //get All users that are not marked as deleted
  async findAll() {
    return this.authRepository.findAll();
  }

  // Register a new user
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existing = await this.authRepository.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.passwordService.hash(dto.password);

    const user = await this.authRepository.create({
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    return this.buildAuthResponse(user.id, user.email);
  }

  // Authenticate a user and return an access token
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await this.passwordService.compare(
      dto.password,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user.id, user.email);
  }

  // Get the profile of the authenticated user
  async getProfile(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  private buildAuthResponse(userId: string, email: string): AuthResponseDto {
    return {
      id: userId,
      email,
      accessToken: this.generateToken(userId, email),
    };
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign(
      {
        sub: userId,
        email,
      },
      {
        expiresIn: '7d',
      },
    );
  }
}
