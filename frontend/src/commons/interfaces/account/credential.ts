export interface Credential {
  name: string
  birthday: string
  gender: Gender
  createdAt: Date
  updatedAt: Date
}

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}
