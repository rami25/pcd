import { Types } from 'mongoose';
import { Client } from '../../../shared/src/types/Client';

export interface ClientDao {
  createClient(client : Client): Promise<void>;
  deleteClient(id: Types.ObjectId): Promise<void>; 
  getClientById(id: Types.ObjectId): Promise<Client | undefined>;
  getClientByPersonId(personId: string): Promise<Client | undefined>;
  getClientByCardId(cardId: string): Promise<Client | undefined>;
  getClientByName(name: string): Promise<Client | undefined>;
  countClients() : Promise<number>;
  withdraw(id: Types.ObjectId, fees: number): Promise<void>;
}