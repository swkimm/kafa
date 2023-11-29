const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR

/** JWT Token Expiration Settings */
export const ACCESS_TOKEN_EXPIRE_TIME = 30 * SECONDS_PER_MINUTE
export const REFRESH_TOKEN_EXPIRE_TIME = SECONDS_PER_DAY * 1000
export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  maxAge: 28 * SECONDS_PER_DAY,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
}

/* Email Verification Pin Settings */
export const EMAIL_VERIFICATION_PIN_EXPIRE_TIME = 10 * SECONDS_PER_MINUTE * 1000
