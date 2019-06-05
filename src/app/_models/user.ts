import { Role } from "./role";

export class User {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: Role;
    token?: string;
	url?: string;
	gender?: string;
	comments?: string;
	adhaar?: number;
}