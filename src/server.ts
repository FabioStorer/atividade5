import express, { Express, Request, Response, NextFunction } from 'express';
import { loggingMiddleware } from './middlewares/logging_middleware';
import { routeErrorMiddleware, AppError } from './middlewares/route_error_middleware';
import { UserRepository, Client } from './repositories/user_repository';
import dotenv from 'dotenv';

dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
}
);

const app: Express = express();
const userRepository = new UserRepository();

app.use(express.json());
app.use(loggingMiddleware);

app.post('/signup', async (req: Request, res: Response) => {
    try {
        const newClient: Client = req.body;
        await userRepository.add(newClient);
        return res.send('Novo usuário cadastrado com sucesso!');
    } catch (error) {
        return res.status(400).send('Erro ao cadastrar usuário.');
    }
});

app.get('/clients', async (req: Request, res: Response) => {
    const clients = await userRepository.getAll();
    res.json(clients);
});

app.get('/clients/:cpf', async (req: Request, res: Response, next: NextFunction) => {
    const cpf = Number(req.params.cpf);
    const cliente = await userRepository.getByCpf(cpf);

    if (!cliente) {
        return next(new AppError("Cliente não encontrado", 404));
    }

    res.json(cliente);
});

app.put('/clients/:cpf', async (req: Request, res: Response) => {
    const cpfParam = Number(req.params.cpf);
    const updatedClient: Client = req.body;

    const success = await userRepository.update(cpfParam, updatedClient);

    if (!success) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    return res.send('Cliente atualizado com sucesso!');
});

app.delete('/clients/:cpf', async (req: Request, res: Response) => {
    const cpf = Number(req.params.cpf);
    const success = await userRepository.delete(cpf);

    if (!success) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.send('Cliente removido com sucesso!');
});

app.use(routeErrorMiddleware);

app.listen(process.env.API_PORT, () => {
    console.log(`Server running at port ${process.env.API_PORT}.`);
});