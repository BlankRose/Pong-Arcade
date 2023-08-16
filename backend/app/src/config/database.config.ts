/* ************************************************************************** */
/*          .-.                                                               */
/*    __   /   \   __                                                         */
/*   (  `'.\   /.'`  )   Pong-Arcade - database.config.ts                     */
/*    '-._.(;;;)._.-'                                                         */
/*    .-'  ,`"`,  '-.                                                         */
/*   (__.-'/   \'-.__)   By: Rosie (https://github.com/BlankRose)             */
/*       //\   /         Last Updated: Wednesday, August 16, 2023 5:29 PM     */
/*      ||  '-'                                                               */
/* ************************************************************************** */

import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB
}));
