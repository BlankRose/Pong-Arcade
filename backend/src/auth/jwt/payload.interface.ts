import { User } from "src/users/user.entity";

export class AuthPayload {
	constructor(user: User) {
		this.id = user.id;
	}

	id: number;
}
