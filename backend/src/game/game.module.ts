import { Module } from '@nestjs/common';
import { Game } from './game.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import GameGateway from './game.gateway';
import { GameService } from './game.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Game])
    ],
	providers: [GameGateway, GameService],
	exports: [GameGateway, GameService]
})

export class GameModule {}
