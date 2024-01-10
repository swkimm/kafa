import type { CookieOptions } from 'express'

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR

const SECONDS_TO_MILLISECONDS = 1000

/** JWT Token Expiration Settings */
export const ACCESS_TOKEN_EXPIRE_TIME = '10s'
export const REFRESH_TOKEN_EXPIRE_TIME = '28d'
export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  maxAge: 14 * SECONDS_PER_DAY * SECONDS_TO_MILLISECONDS,
  httpOnly: true,
  secure:
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
  sameSite: 'strict',
  path: '/api/auth/reissue'
}
export const REFRESH_TOKEN_CACHE_EXIPRE_TIME =
  14 * SECONDS_PER_DAY * SECONDS_TO_MILLISECONDS

/* Email Verification Pin Settings */
export const EMAIL_VERIFICATION_PIN_EXPIRE_TIME =
  10 * SECONDS_PER_MINUTE * SECONDS_TO_MILLISECONDS

/* CloudFront Signed Cookie Settings */
export const CLOUDFRONT_SIGNED_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  maxAge: 15 * SECONDS_PER_MINUTE * SECONDS_TO_MILLISECONDS,
  secure: true,
  path: '/',
  domain: '.kafa.one',
  sameSite: 'lax'
}
