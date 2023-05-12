export interface dbUser {
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  isAdmin: boolean;
  shifts?: object[];
}
