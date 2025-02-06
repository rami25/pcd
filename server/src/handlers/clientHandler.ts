import { 
        SignRequest,
        SignResponse
} from '../../../shared/src/APIs/api'
import { ERRORS } from '../../../shared/src/errors'
import { ExpressHandler } from "../types"
import { Client } from '../../../shared/src/types/Client'
import { db } from '../dao';

export const signClientHandler : ExpressHandler< 
SignRequest,
SignResponse
> = async (req, res) => {
    const { name , cardId , faceId } = req.body
    if(!name || !cardId || !faceId)
        return res.sendStatus(400)

    if (await db.getClientByName(name)) {
      return res.status(403).send({ error: ERRORS.DUPLICATE_USERNAME });
    }
    const newClient : Client = {
        name,
        cardId,
        faceId
    }    
    await db.createClient(newClient)
    res.status(200).send({ message : 'Client Was Signed Successfully' });
}