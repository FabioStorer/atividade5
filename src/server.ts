import express, { Express, Request, Response } from 'express';
import { loggingMiddleware } from './middlewares/logging_middleware';
import 'dotenv/config.js';

const app: Express = express();

app.use(express.json());
app.use(loggingMiddleware)

interface Pessoa {
    name: string,
    cpf: number,
    yearBirth: string
};

interface Endereco extends Pessoa {
    street: string
    city: string,
    state: string,
    country: string
};

interface Client extends Endereco {
    email: string
};

const clients: Client[] = [];

const client = {
    name: 'Marcos',
    cpf: 12345678,
    yearBirth: '2000',
    street: 'abacate',
    city: 'laranja',
    state: 'mamao',
    country: 'apple',
    email: 'marcosteste@gmail.com'
};

clients.push(client);

app.post('/signup', (req: Request, res: Response) => {
    try {
        const newClient: Client = req.body;

        if (client.name === undefined &&
            client.cpf === undefined &&
            client.yearBirth === undefined &&
            client.street === undefined &&
            client.city === undefined &&
            client.state === undefined &&
            client.country === undefined &&
            client.email === undefined) {
            console.log('Dados inválidos.');
        } else {
            clients.push(newClient);
            return res.send('Novo usuário cadastrado com sucesso!');
        }
    } catch (error) {
        return res.status(400).send('Dados inválidos.');
    }
});

app.get('/clients', (req: Request, res: Response) => {
    res.json(clients);
})

app.get('/clients/:cpf', (req: Request, res: Response) => {
    try {
        const cpf = Number(req.params.cpf);
        const cliente = clients.find(c => c.cpf === cpf);

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        return res.json(cliente);
    } catch (error) {
        return res.status(400).send('Cliente não encontrado.');

    }
});

app.put('/clients/:cpf', (req: Request, res: Response) => {
    try {
        const cpfParam = Number(req.params.cpf);

        const index = clients.findIndex(c => c.cpf === cpfParam);

        if (index === -1) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        let updatedClient = req.body;

        clients[index] = updatedClient;

        return res.send('Cliente atualizado com sucesso!');
    } catch (err) {
        return res.status(400).send('Dados inválidos e/ou faltando.');
    }
});


app.delete('/clients/:cpf', (req: Request, res: Response) => {
    const cpf = Number(req.params.cpf);

    const index = clients.findIndex(c => c.cpf === cpf);

    if (index === -1) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    clients.splice(index, 1);

    res.send('Cliente removido com sucesso!');
});

app.listen(process.env.API_PORT, () => {
    console.log(`Server running at port ${process.env.API_PORT}.`);
});