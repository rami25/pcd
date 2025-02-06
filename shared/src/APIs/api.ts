import { Admin } from "../types/Admin";
export interface SignRequest {
    name : string;
    cardId : string;
    faceId : string;
}
export interface SignResponse {
    message? : string;
}
export interface AdminSignInRequest {
    login : string;
    password : string;
}
export interface AdminSignInResponse {
    admin : Pick<Admin, '_id'>;
    jwt : string; 
}
export interface WithdrawRequest {
    faceId : string;
    fees : string;
}
export interface WithdrawResponse {
    message? : string;
}
export interface SignOutRequest {
    clientId : string;
}
export interface SignOutResponse {
    message? : string;
}

export interface ResetPasswordRequest {
    newPassword : string;
}
export interface ResetPasswordResponse {
    message? : string;
}