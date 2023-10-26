import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
// import { loginMiddleware, verifyJWT } from '../../../middlewares/auth-middlewares';
// import UserRoles from '../../../../utils/constants/userRoles';
// import statusCodes from '../../../../utils/constants/statusCodes';

// import { userInfo } from 'os';
// import { parse } from 'path';

const router = Router();

// router.post('/login', async (req: Request, res: Response, next: NextFunction) => {});
// router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {});

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

router.get('/allUsers', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await UserService.read();
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.deleteUser(parseInt(req.params.id));
		res.status(200).json(user);
	}
	catch (error) {
		next(error);
	}
});

router.put('/update', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, name, email, photo, password, role } = req.body;
		if (req.body.id === undefined) {
			res.status(404).json('Usuário não encontrado');
		}
		await UserService.updateUser({ id: parseInt(id), name, email, photo, password, role });
		res.status(200).json({ id: parseInt(id), name, email, photo, password, role });
	} catch (error) {
		next(error);
	}
});

export default router;