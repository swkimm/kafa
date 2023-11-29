export const refreshTokenCacheKey = (accountId: number) =>
  `account:${accountId}:refresh_token`

export const emailVerificationCacheKey = (accountId: number) =>
  `account:${accountId}:email_verification`

export const emailUpdateVerificationCacheKey = (accountId: number) =>
  `account:${accountId}:email_update_verification`

export const registerTeamRequestCacheKey = (teamId: number) =>
  `team:${teamId}:register_team_request`
