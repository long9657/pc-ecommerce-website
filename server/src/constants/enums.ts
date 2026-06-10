export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
export enum UserRole {
  Admin,
  User
}

export enum PurchaseStatus {
  IN_CART = 0,
  WAIT_FOR_CONFIRMATION = 1,
  IN_PROGRESS = 2,
  DELIVERED = 3,
  CANCELLED = 4
}
