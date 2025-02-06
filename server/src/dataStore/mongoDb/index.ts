import ClientM, { Client } from "../../../../shared/src/types/Client";
import AdminM, { Admin } from "../../../../shared/src/types/Admin";
import { DataStore } from "../../dao";
import { Types } from "mongoose";
import { ObjectId } from "../../../../shared/src/connection";


export class MongoDB implements DataStore {
    async createClient(client: Client): Promise<void> {
        const newClient = await ClientM.create(client)
        await newClient.save()
    }
    async deleteClient(id: Types.ObjectId): Promise<void> {
        const clientId = new ObjectId(id)
        await ClientM.findByIdAndDelete(clientId)
    }

    async getClientById(id: Types.ObjectId): Promise<Client | undefined> {
        return await ClientM.findOne().where("_id").equals(id) || undefined
    }
    async getClientByFaceId(id: string): Promise<Client | undefined> {
        return await ClientM.findOne().where("faceId").equals(id) || undefined
    }
    async getClientByName(name: string): Promise<Client | undefined> {
        return await ClientM.findOne().where("name").equals(name) || undefined
    }
    async countClients(): Promise<number> {
        return await ClientM.countDocuments()
    }


    async getAdminById(id: Types.ObjectId): Promise<Admin | undefined> {
        return await AdminM.findOne().where("_id").equals(id) || undefined
    }
    async getAdminByName(name: string): Promise<Admin | undefined> {
        return await AdminM.findOne().where("name").equals(name) || undefined
    }
    async getAdminByEmail(email: string): Promise<Admin | undefined> {
        return await AdminM.findOne().where("email").equals(email) || undefined
    }
    async getAdminByToken(token: string): Promise<Admin | undefined> {
        const admin = await AdminM.findOne({
                        resetPasswordToken: token,
                        resetPasswordExpires: { $gt: Date.now() }
                    }) || undefined
        return admin
    }
    async updateCurrentAdmin(admin: Partial<Admin>): Promise<void> {
        await AdminM.findByIdAndUpdate(admin._id, admin , {new : true})
    }
}

