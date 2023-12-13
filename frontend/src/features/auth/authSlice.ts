// src/features/auth/authSlice.ts
import type { RootState } from '@/app/store'
import axiosInstance from '@/common/axios'
import {
  createSlice,
  type PayloadAction,
  createAsyncThunk
} from '@reduxjs/toolkit'
import axios, { type AxiosError } from 'axios'

interface AuthState {
  user: string | null
  token: string | null
  isLoggedIn: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  role: 'user' | 'manager' | 'admin'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  status: 'idle',
  role: 'user',
  error: null
}

interface LoginResponse {
  user: string
  token: string
  role: 'user' | 'manager' | 'admin'
}

// 로그인
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password
      })
      return response.data
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

      // 토큰 로깅
      console.log('Sending token:', token)

      const response = await axiosInstance.get('/account/role', {
        headers: { Authorization: `Bearer ${token}` }
      })

      // 요청과 응답 로깅
      console.log('Response data:', response.data)

      return response.data.role
    } catch (error) {
      const axiosError = error as AxiosError // 타입 단언
      console.error('Error fetching role:', axiosError)

      if (axiosError.response) {
        // 서버로부터의 응답이 있는 경우, 그 내용도 출력
        console.error('Error response:', axiosError.response)
      }

      return rejectWithValue('Failed to fetch role')
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.user = action.payload.user
          state.token = action.payload.token
          state.isLoggedIn = true
          state.status = 'succeeded'
          state.role = action.payload.role
        }
      )
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

export const { logout } = authSlice.actions

export default authSlice.reducer
