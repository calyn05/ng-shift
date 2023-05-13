export interface dbUser {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  isAdmin: boolean;
  email?: string;
  shifts?: object[];
}
