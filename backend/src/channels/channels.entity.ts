// channels/channels.entity.ts

// channels/channels.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Message } from '../messages/messages.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'public' }) // 'public', 'private', 'password'
  type: string;

  @Column({ default: false })
  isPrivate: boolean; // Ajout de la propriété isPrivate

  @Column({ nullable: true })
  password: string;

  @ManyToOne(() => User)
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];

  
  @ManyToMany(() => User, user => user.channels)
  users: User[]

}