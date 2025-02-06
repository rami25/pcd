import { 
        ResetPasswordRequest,
        ResetPasswordResponse,
        AdminSignInRequest, 
        AdminSignInResponse, 
        SignOutRequest, 
        SignOutResponse, 
        WithdrawRequest,
        WithdrawResponse
} from '../../../shared/src/APIs/api'
import { ExpressHandler, ExpressHandlerWithParams } from "../types"
import { db } from '../dao';
import { signJwt } from '../auth'
import { hashPassword } from '../env';
import { ObjectId } from '../../../shared/src/connection';
import { Client } from '../../../shared/src/types/Client'

export const signInHandler : ExpressHandler<
AdminSignInRequest,
AdminSignInResponse
> = async (req, res) => {
    const { login , password } = req.body
    if(!login || !password){
        return res.status(400).send({error:'all fields are required'})
    }
    const existing = (await db.getAdminByName(login)) || (await db.getAdminByEmail(login))
    if(!existing || existing.password !== hashPassword(password)){
        return res.status(403).send({error: 'unauthorized'})
    }
    const jwt = signJwt({adminId : existing._id!})
    // Store JWT in cookie or local storage or session storage
    // res.cookie('jwt', jwt);
    res.status(200).send({
        admin: {
            _id: existing._id,
        },
        jwt,
    })    
}

export const withdrawHandler : ExpressHandler<
WithdrawRequest,
WithdrawResponse
> = async (req, res) => {
    const { faceId , fees } = req.body
    if(!faceId || !fees){
        return res.status(400).send({error:'all fields are required'})
    }
    const existing = await db.getClientByFaceId(faceId);
    if(!existing) {
        return res.status(403).send({error: 'unauthorized'})
    }
    res.status(200).send({ message: 'done'})    
}

export const countClientHandler : ExpressHandler<{},{clients: number}> = async(req, res) => {
    res.status(200).send({clients : await db.countClients()})
}

export const getClientHandler : ExpressHandler<any,{client:Client}> = async (req, res) => {
    const { faceId } = req.body
    const client = await db.getClientByFaceId(faceId)
    if(client) {
        return res.status(200).send({client})
    } else {
        res.sendStatus(404)    
    }
}

export const deleteClientHandler : ExpressHandler<
SignOutRequest,
SignOutResponse
> = async (req, res) => {
    const adminId = res.locals.adminId
    const { clientId } = req.body;
    if(adminId) {
        if(clientId){
            const client = await db.getClientById(new ObjectId(clientId))
            if(!client)
                return res.status(400).send({error:'User not authorized to deleting this post'})
            await db.deleteClient(new ObjectId(clientId))
            return res.status(200).send({message :'Post deleted successfully!'})
        } else {
            return res.status(401);
        }
    } else {
        return res.status(403).send({error: 'unauthorized'})
    }
}

export const resetPassword : ExpressHandlerWithParams<
{token : string},
ResetPasswordRequest,
ResetPasswordResponse
> = async (req, res) => {
    const admin = await db.getAdminByToken(req.params.token!)
    if (!admin) {
       return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const { newPassword } = req.body
    if(newPassword){
        admin.password = hashPassword(newPassword)
        await db.updateCurrentAdmin(admin)
        res.redirect('/admin/sign-in')
        return res.status(200).json({ message: 'Password reset successful' });
    }
    else{
       return res.status(400).json({ error: 'password is required' });
    }
}