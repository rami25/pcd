import { 
        ResetPasswordRequest,
        ResetPasswordResponse,
        AdminSignInRequest, 
        AdminSignInResponse, 
        AdminSignUpRequest, 
        AdminSignUpResponse, 
        SignOutRequestByPId, 
        SignOutResponseByPId,
        SignOutRequestByCardId, 
        SignOutResponseByCardId, 
        WithdrawRequestByPId,
        WithdrawResponseByPId,
        WithdrawRequestByCardId,
        WithdrawResponseByCardId
} from '../../../shared/src/APIs/api'
import { ERRORS } from '../../../shared/src/errors'
import { ExpressHandler, ExpressHandlerWithParams } from "../types"
import { db } from '../dao';
import { signJwt } from '../auth'
import { hashPassword } from '../env';
import { ObjectId } from '../../../shared/src/connection';
import { Admin } from '../../../shared/src/types/Admin'


export const signUpHandler : ExpressHandler<
AdminSignUpRequest,
AdminSignUpResponse
> = async (req, res) => {
    const { name, email , password } = req.body
    if(!name || !email || !password){
        return res.status(400).send({error:'all fields are required'})
    }
    if (await db.getAdminByName(name)) {
        return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
    }
    if (await db.getAdminByEmail(email)) {
        return res.status(403).send({ error: ERRORS.DUPLICATE_EMAIL });
    }
    const newAdmin: Admin = {
        name,
        email,
        password : hashPassword(password)
    }
    const admin = await db.createAdmin(newAdmin)
    const jwt = signJwt({adminId : admin!._id!})
    res.cookie('jwt', jwt);
    res.status(200).send({
        admin: {
            _id: admin!._id,
        },
        jwt,
    })    
}


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

export const withdrawHandlerByPId : ExpressHandler<
WithdrawRequestByPId,
WithdrawResponseByPId
> = async (req, res) => {
    const { personId , fees } = req.body
    if(!personId || !fees){
        return res.status(400).send({error:'all fields are required'})
    }
    const existing = await db.getClientByPersonId(personId);
    if(!existing) {
        return res.status(403).send({error: 'Client not found'})
    }
    await db.withdraw(new ObjectId(existing._id), fees)
    res.status(200).send({ message: 'done'})    
}

export const withdrawHandlerByCardId : ExpressHandler<
WithdrawRequestByCardId,
WithdrawResponseByCardId
> = async (req, res) => {
    const { cardId , fees } = req.body
    if(!cardId || !fees){
        return res.status(400).send({error:'all fields are required'})
    }
    const existing = await db.getClientByCardId(cardId);
    if(!existing) {
        return res.status(403).send({error: 'Client not found'})
    }
    await db.withdraw(new ObjectId(existing._id), fees)
    res.status(200).send({ message: 'done'})    
}

export const countClientHandler : ExpressHandler<{},{clients: number}> = async(req, res) => {
    res.status(200).send({clients : await db.countClients()})
}

// export const getClientHandler : ExpressHandler<any,{client:Client}> = async (req, res) => {
//     const { personId } = req.body
//     const client = await db.getClientByPersonId(personId)
//     if(client) {
//         return res.status(200).send({client})
//     } else {
//         res.sendStatus(404)    
//     }
// }

export const deleteClientHandlerByPId : ExpressHandler<
SignOutRequestByPId,
SignOutResponseByPId
> = async (req, res) => {
    const adminId = res.locals.adminId
    const { personId } = req.body;
    if(adminId) {
        if(personId){
            const client = await db.getClientByPersonId(personId)
            if(!client)
                return res.status(400).send({error:'Client not found'})
            await db.deleteClient(new ObjectId(client._id))
            return res.status(200).send({message :'Client deleted successfully!'})
        } else {
            return res.status(401);
        }
    } else {
        return res.status(403).send({error: 'unauthorized'})
    }
}

export const deleteClientHandlerByCardId : ExpressHandler<
SignOutRequestByCardId,
SignOutResponseByCardId
> = async (req, res) => {
    const adminId = res.locals.adminId
    const { cardId } = req.body;
    if(adminId) {
        if(cardId){
            const client = await db.getClientByCardId(cardId)
            if(!client)
                return res.status(400).send({error:'Client not found'})
            await db.deleteClient(new ObjectId(client._id))
            return res.status(200).send({message :'Client deleted successfully!'})
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