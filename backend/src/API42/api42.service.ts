import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class Api42Service {
	constructor(
		private readonly configService: ConfigService
	) {}

	async getClientToken(): Promise<string> {
		const api42_uuid = this.configService.get('api42.clientId');
		const api42_secret = this.configService.get('api42.clientSecret');

		const url = `https://api.intra.42.fr/oauth/token`
			+ `?grant_type=client_credentials`
			+ `&client_id=${api42_uuid}`
			+ `&client_secret=${api42_secret}`;
		const response = await axios.post(url);
		const token = response.data.access_token;

		return token;
	}

	async getUserToken(code: string): Promise<string> {
		const api42_uuid = this.configService.get('api42.clientId');
		const api42_secret = this.configService.get('api42.clientSecret');

		const url = `https://api.intra.42.fr/oauth/token`
			+ `?grant_type=authorization_code`
			+ `&client_id=${api42_uuid}`
			+ `&client_secret=${api42_secret}`
			+ `&code=${code}&redirect_uri=http://127.0.0.1:5500/login`;
		const response = await axios.post(url)
			.catch((error) => {
				console.warn("WARNING: getUserToken failed!")
				console.warn("Reason:", error.response.data.error_description);
				throw new ServiceUnavailableException();
			});
		return response.data.access_token;
	}

	async getUserData(token: string): Promise<any> {
		const response = await axios.get('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.catch((error) => {
				console.warn("WARNING: getUserData failed!")
				console.warn("Reason:", error.response.data.error);
				throw new ServiceUnavailableException();
			});
		return response.data;
	}
}
