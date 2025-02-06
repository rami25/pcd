import { Types } from 'mongoose';
import { Client } from '../../../shared/src/types/Client';

export interface ClientDao {
  createClient(client : Client): Promise<void>;
  deleteClient(id: Types.ObjectId): Promise<void>; 
  getClientById(id: Types.ObjectId): Promise<Client | undefined>;
  getClientByFaceId(id: string): Promise<Client | undefined>;
  getClientByName(name: string): Promise<Client | undefined>;
  countClients() : Promise<number>;
}