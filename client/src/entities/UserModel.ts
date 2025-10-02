import {RoleModel} from "entities/RoleModel";

export type UserModel = {
    id: number | null;
    username: string;
    email: string;
    password: string | null;
    role: string;
    createdAt?: number;
    updatedAt?: number;
}
