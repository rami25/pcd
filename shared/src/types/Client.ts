import { Schema, model, Types} from 'mongoose';

export interface Client {
    _id?: Types.ObjectId;
    name?: string
    cardId : string;
    faceId: string;
}
const clientSchema = new Schema<Client>({
    name : {
        type : String,
        required : true
    },
    cardId : {
        type : String,
        required : true
    },
    faceId : {
        type : String,
        required : true
    },
})
const ClientM = model<Client>('ClientM', clientSchema)
export default ClientM