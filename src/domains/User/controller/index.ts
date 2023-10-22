import { User } from '@prisma/client';
import UserService from '../services/UserService';

import { Router, Request, Response, NextFunction } from 'express';
import { parse } from 'path';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;
		// res.send('Running')
		const users = await UserService.readUserByID(Number(id));
		res.status(200).json(users);
		// const users = await UserService.readByEmail('test@test.com');
		// res.status(200).json(users);
	} catch (error) {
		next(error);
	}
});


router.get('/:email', async(req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readByEmail(req.params.email);
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

router.put ('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {id, name, email, photo, password, role }= req.body
		if (req.body.id === undefined) {
			res.status(404).json("Usuário não encontrado");
		}
		await UserService.updateUser({id: parseInt(id), name, email, photo, password, role});
		res.status(200).json({id: parseInt(id), name, email, photo, password, role});
	} catch (error){ 
	  next(error);
	}
  });
  

export async function createUser(body: User) {
	try {
		const user = await UserService.create(body);
	} catch (error) {
		console.log(error);
	}
};

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