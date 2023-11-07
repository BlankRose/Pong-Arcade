import { Module } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import GameGateway from './game.gateway';
import { GameService } from './game.service';
import { AuthGuard } from 'src/auth/jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Game]),
		JwtModule
    ],
	providers: [GameGateway, GameService, AuthGuard],
	exports: [GameGateway, GameService]
})

export class GameModule {}
