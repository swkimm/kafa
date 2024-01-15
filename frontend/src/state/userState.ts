// src/state/userState.js
import { Role } from '@/commons/interfaces/account/profile'
import { atom } from 'recoil'

export const userState = atom({
  key: 'userState',
  default: {
    isLoggedIn: false,
    token: null,
    role: Role.Public,
    isRoleLoaded: false
  }
})
