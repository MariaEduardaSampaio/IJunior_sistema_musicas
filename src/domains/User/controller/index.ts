import UserService from '../services/UserService';

import { Router, Request, Response, NextFunction } from 'express';
import { userInfo } from 'os';
import { parse } from 'path';

const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.create(req.body);
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

router.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readUserByID(Number(req.params.id));
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserService.create(req.body);
		res.json("Usuário criado com sucesso");

	} catch (error){
		next(error);
	}
});

router.get('/email/:email', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readByEmail(req.params.email);
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.deleteUser(parseInt(req.params.id));
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

export default router;