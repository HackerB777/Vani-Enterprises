export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'admin' | 'user';
  createdAt: string;
}
