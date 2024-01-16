import { atom } from 'recoil'

export enum NotificationType {
  Success = 'Success',
  Warning = 'Warning',
  Error = 'Error'
}

export const notificationState = atom({
  key: 'notificationState',
  default: {
    isShow: false,
    type: NotificationType.Success,
    title: '',
    message: '',
    age: 1500
  }
})
