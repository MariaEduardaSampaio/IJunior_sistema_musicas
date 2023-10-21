import { User } from '@prisma/client';
import UserService from '../services/UserService';

import { Router, Request, Response, NextFunction } from 'express';

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

router.get('/email/:email', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readByEmail(req.params.email);
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

export async function readUserByID(id: number) {
	try {
		return await UserService.readUserByID(id);
	}
	catch (error) {
		console.log(error);
	}
}

export async function readUserByEmail(email: string) {
	try {
		return await UserService.readByEmail(email);
	} catch (error) {
		console.log(error);
	}
}

export async function updateUser(body: User) {
	try {
		return await UserService.updateUser(body);
	}
	catch (error) {
		console.log(error);
	}
}

export async function deleteUser(id: number) {
	try {
		return await UserService.deleteUser(id);
	}
	catch (error) {
		console.log(error);
	}
}

export default router;