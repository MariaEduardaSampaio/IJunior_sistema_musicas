import UserService from '../services/UserService';

import { Router, Request, Response, NextFunction } from 'express';
import { parse } from 'path';

const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
<<<<<<< HEAD
		const id = req.params.id;
		// res.send('Running')
		const users = await UserService.readUserByID(Number(id));
		res.status(200).json(users);
		// const users = await UserService.readByEmail('test@test.com');
		// res.status(200).json(users);
=======
		const user = await UserService.create(req.body);
		res.status(200).json(user);
>>>>>>> 204846b94fe425d9f680ab09912a1d33a7be798c
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

<<<<<<< HEAD
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
=======
router.get('/email/:email', async (req: Request, res: Response, next: NextFunction) => {
>>>>>>> 204846b94fe425d9f680ab09912a1d33a7be798c
	try {
		const user = await UserService.readByEmail(req.params.email);
		res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

export default router;