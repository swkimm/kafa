// src/features/auth/authSlice.ts
import type { AppDispatch, RootState } from '@/app/store'
import axiosInstance from '@/commons/axios'
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction
} from '@reduxjs/toolkit'
import axios, { type AxiosError } from 'axios'

interface AuthState {
  user: string | null
  token: string | null
  refreshToken: string | null
  isLoggedIn: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  role: string
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoggedIn: false,
  status: 'idle',
  role: '',
  error: null
}

// 로그인
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        '/auth/login',
        {
          username,
          password
        },
        {
          withCredentials: true
        }
      )
      const token = response.headers.authorization
      localStorage.setItem('token', token)
      return { token }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message =
          error.response.data.message || 'An unknown error occurred'
        return rejectWithValue(message)
      }
      return rejectWithValue('An unknown error occurred')
    }
  }
)

// 역할 불러오기
export const getRole = createAsyncThunk(
  'auth/getRole',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.token

      const response = await axiosInstance.get('/account/role', {
        headers: { authorization: token }
      })

      return response.data.role
    } catch (error) {
      const axiosError = error as AxiosError
      console.error('Error fetching role:', axiosError)
      if (axiosError.response) {
        console.error('Error response data:', axiosError.response.data)
      }
      return rejectWithValue('Failed to fetch role')
    }
  }
)

// reissue 처리
export const reissueToken = createAsyncThunk(
  'auth/reissue',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState
    const refreshToken = state.auth.refreshToken
    if (!refreshToken) {
      return rejectWithValue('리프레시 토큰이 없습니다')
    }

    try {
      const response = await axiosInstance.get('/auth/reissue')
      const newAccessToken = response.data.accessToken

      localStorage.setItem('token', newAccessToken)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message)
      }
      return rejectWithValue('토큰 재발급 실패')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isLoggedIn = false
    },
    setLoginState(
      state,
      action: PayloadAction<{ isLoggedIn: boolean; token: string | null }>
    ) {
      state.isLoggedIn = action.payload.isLoggedIn
      state.token = action.payload.token
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Login payload:', action.payload)
        state.token = action.payload.token
        state.isLoggedIn = true
        state.status = 'succeeded'
        console.log('isLoggedIn after login:', state.isLoggedIn)
      })
      .addCase(loginUser.rejected, (state, action) => {
        const error = action.payload as AxiosError
        state.error = error.message
        state.status = 'failed'
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.role = action.payload
      })
  }
})

export const logoutUser = () => (dispatch: AppDispatch) => {
  // 로컬 스토리지에서 토큰 제거
  localStorage.removeItem('token')
  dispatch(logout())
}

export const { logout, setLoginState } = authSlice.actions

export default authSlice.reducer
