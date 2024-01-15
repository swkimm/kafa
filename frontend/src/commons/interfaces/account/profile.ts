export interface Profile {
  id: number
  name: string
  email: string
  profileImgUrl: string
  role: string
}

export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User',
  Public = 'Public'
}
