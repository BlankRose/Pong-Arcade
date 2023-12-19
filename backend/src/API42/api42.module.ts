import { Module } from '@nestjs/common';
import { Api42Service } from './api42.service';

import { ConfigModule } from '@nestjs/config';
import Api42Config from '../config/api42.config';

@Module({
	imports: [ConfigModule.forFeature(Api42Config)],
	controllers: [],
	providers: [Api42Service],
	exports: [Api42Service],
})

export class Api42Module {}
