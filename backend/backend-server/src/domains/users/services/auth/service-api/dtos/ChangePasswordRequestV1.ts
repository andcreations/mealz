export interface ChangePasswordRequestV1 {
  userId: string;
  oldPassword: string;
  newPassword: string;
}