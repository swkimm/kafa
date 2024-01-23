export interface Profile {
  id: number
  name: string
  email: string
  profileImgUrl: string
  role: Role
  teamId?: number
}

export enum Role {
  Admin = 'Admin',
  Manager = 'Manager',
  User = 'User',
  Public = 'Public'
}
