import {
  type NotificationType,
  notificationState
} from '@/state/notificationState'
import { useRecoilState } from 'recoil'

const useNotification = () => {
  const [notification, setNotification] = useRecoilState(notificationState)

  /**
   * 글로벌 알림 창을 표시합니다
   *
   * @param {NotificationType} type - 알림 타입
   * @param {string} title - 알림 제목
   * @param {string} message - 알림 메세지
   * @param {number} [age=1500] - 표시 시간(ms), 기본 1500ms
   */
  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
    age?: number
  ): void => {
    setNotification({
      title,
      message,
      type,
      isShow: true,
      age: age ? age : 1500
    })
  }

  const closeNotification = (): void => {
    setNotification({
      ...notification,
      isShow: false
    })
  }

  return { showNotification, closeNotification }
}

export default useNotification
