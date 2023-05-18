import { Shift } from './shift';

export interface dbUser {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  isAdmin: boolean;
  email?: string;
  uid?: string;
  shifts?: Shift[];
}
