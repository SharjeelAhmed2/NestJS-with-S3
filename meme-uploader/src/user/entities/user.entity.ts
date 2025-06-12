export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  READONLY = 'readonly',
}

export class User {
  id: number;
  username: string;
  password: string; // hashed
  role: Role;
}