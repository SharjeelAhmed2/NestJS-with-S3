import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, Role as PrismaRole, User } from '@prisma/client';
import { Role as DomainRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

   async create(
    email: string,
    password: string,
    role: DomainRole = DomainRole.USER      // still using your lowercase-domain enum here
  ) {
    const hashed = await bcrypt.hash(password, 10);

    // map it to Prisma’s uppercase enum
    const prismaRole = PrismaRole[role.toUpperCase() as keyof typeof PrismaRole];

    return this.prisma.user.create({
      data: {
        email,
        password: hashed,
        role:     prismaRole,                // now TS is happy
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}