import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  //get all users that are not marked as deleted
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
  }
  // Find a user by email, ensuring they are not marked as deleted
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }
  // Find a user by ID, ensuring they are not marked as deleted
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }
  // Create a new user with the provided data
  async create(
    data: Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>,
  ): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  // delete a user by Id
  async delete(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
