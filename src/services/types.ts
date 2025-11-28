export interface Engine {
  type: string
  fuel: string
  hp: number
  transmission: string
}

export interface Car {
  _id: string
  brand: string
  model: string
  year: number
  price: number
  currency: string
  engine: Engine
  km: number
  condition: string
  imageUrl: string
  status: string
  tags: string[]
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  role?: 'admin' | 'user';
  cart?: string[];
  image?: string;
}