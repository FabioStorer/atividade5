import { promises as fs } from "fs";
import path from "path";

export interface Pessoa {
    name: string;
    cpf: number;
    yearBirth: string;
}

export interface Endereco extends Pessoa {
    street: string;
    city: string;
    state: string;
    country: string;
}

export interface Client extends Endereco {
    email: string;
}

const FILE_PATH = path.resolve(__dirname, "../data/clients.json");

export class UserRepository {
    private async readFile(): Promise<Client[]> {
        try {
            const data = await fs.readFile(FILE_PATH, "utf-8");
            return JSON.parse(data) as Client[];
        } catch (err: any) {
            if (err.code === "ENOENT") {
                return [];
            }
            throw err;
        }
    }

    private async writeFile(clients: Client[]): Promise<void> {
        await fs.writeFile(FILE_PATH, JSON.stringify(clients, null, 2), "utf-8");
    }

    public async getAll(): Promise<Client[]> {
        return this.readFile();
    }

    public async getByCpf(cpf: number): Promise<Client | undefined> {
        const clients = await this.readFile();
        return clients.find(c => c.cpf === cpf);
    }

    public async add(client: Client): Promise<void> {
        const clients = await this.readFile();
        clients.push(client);
        await this.writeFile(clients);
    }

    public async update(cpf: number, updatedClient: Client): Promise<boolean> {
        const clients = await this.readFile();
        const index = clients.findIndex(c => c.cpf === cpf);

        if (index === -1) return false;

        clients[index] = updatedClient;
        await this.writeFile(clients);
        return true;
    }

    public async delete(cpf: number): Promise<boolean> {
        const clients = await this.readFile();
        const index = clients.findIndex(c => c.cpf === cpf);

        if (index === -1) return false;

        clients.splice(index, 1);
        await this.writeFile(clients);
        return true;
    }
};