export interface UserRegister {
  email: string;
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  isAdmin: boolean;
}

export interface UserLogin {
  email: string;
  password: string;
}
