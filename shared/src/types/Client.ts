import { Schema, model, Types} from 'mongoose';

export interface Client {
    _id?: Types.ObjectId;
    name?: string
    cardId : string;
    personId: string;
    amount? : number;
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
    personId : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        default : 1000
    }
})
const ClientM = model<Client>('ClientM', clientSchema)
export default ClientM