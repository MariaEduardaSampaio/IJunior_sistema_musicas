import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { loginMiddleware, verifyJWT, notLoggedIn } from "../../../middlewares/auth-middlewares";

// import UserRoles from '../../../../utils/constants/userRoles';
// import statusCodes from '../../../../utils/constants/statusCodes';

// import { userInfo } from 'os';
// import { parse } from 'path';

import statusCodes from '../../../../utils/constants/statusCodes';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await notLoggedIn(req, res, next);
		await loginMiddleware(req, res, next);
	} catch (error) {
		next(error);
	}

});
// router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserService.create(req.body);
		res.status(statusCodes.CREATED).json('Usuário criado com sucesso!');
	} catch (error) {
		next(error);
	}
});

router.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readUserByID(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(user);
	} catch (error) {
		next(error);
	}
});

router.get('/email/:email', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readByEmail(req.params.email);
		res.status(statusCodes.SUCCESS).json(user);
	} catch (error) {
		next(error);
	}
});

router.get('/allUsers', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await UserService.read();
		res.status(statusCodes.SUCCESS).json(users);
	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserService.deleteUser(parseInt(req.params.id));
		res.status(statusCodes.NO_CONTENT).json('Usuário deletado com sucesso!');
	}
	catch (error) {
		next(error);
	}
});

router.put('/update', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email, photo, password, role } = req.body;
		if (req.body.id === undefined) {
			res.status(statusCodes.BAD_REQUEST).json('O campo id é obrigatório!');
		}
		await UserService.updateUser({ id: parseInt(id), name, email, photo, password, role });
		res.status(statusCodes.NO_CONTENT).json('Usuário atualizado com sucesso!');
	} catch (error) {
		next(error);
	}
});

export default router;