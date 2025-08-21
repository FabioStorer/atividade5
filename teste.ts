import { Request, Response } from 'express';

export const store = async (req: Request<{}, {}, Explorer>, res: Response): Promise<void> => {
    try {
        await Explorer.create(req.body);
        res.status(201).json({ message: "Explorer created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};