export interface Credential {
  name: string
  birthday: Date
  gender: Gender
  createdAt: Date
  updatedAt: Date
}

export enum Gender {
  Male = 'Male',
  Female = 'Female'
}
