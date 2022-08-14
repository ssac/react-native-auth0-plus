export enum AuthenticatorType {
  oob = 'oob',
  otp = 'otp',
  recoveryCode = 'recovery-code',
  auth0 = 'auth0',
}

export enum OobChannel {
  sms = 'sms',
  voice = 'voice',
  email = 'email',
}
