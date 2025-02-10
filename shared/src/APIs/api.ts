import { Admin } from "../types/Admin";
export interface SignRequest { // for client
    name? : string;
    cardId? : string;
    personId? : string;
}
export interface SignResponse {
    message? : string;
}
export interface AdminSignUpRequest {
    name : string;
    email : string;
    password : string;
}
export interface AdminSignUpResponse {
    admin : Pick<Admin, '_id'>;
    jwt : string; 
}
export interface AdminSignInRequest {
    login : string;
    password : string;
}
export interface AdminSignInResponse {
    admin : Pick<Admin, '_id'>;
    jwt : string; 
}
export interface WithdrawRequestByPId {
    personId : string;
    fees : number;
}
export interface WithdrawResponseByPId {
    message? : string;
}
export interface WithdrawRequestByCardId {
    cardId : string;
    fees : number;
}
export interface WithdrawResponseByCardId {
    message? : string;
}
export interface SignOutRequestByPId {
    personId : string;
}
export interface SignOutResponseByPId {
    message? : string;
}
export interface SignOutRequestByCardId {
    cardId : string;
}
export interface SignOutResponseByCardId {
    message? : string;
}
export interface ResetPasswordRequest { // for admin
    newPassword : string;
}
export interface ResetPasswordResponse {
    message? : string;
}