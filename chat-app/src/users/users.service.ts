// src/users/users.service.ts
import * as bcrypt from 'bcrypt';
import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(data: any): Promise<User> {
    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await this.usersRepository.findOne({ where: { username: data.username } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Créez une nouvelle instance de l'entité User
    const user = new User();
    user.username = data.username;
    user.password = await bcrypt.hash(data.password, 10);

    // Sauvegardez l'instance dans la base de données
    const savedUser = await this.usersRepository.save(user);

    return savedUser;
  }
}
