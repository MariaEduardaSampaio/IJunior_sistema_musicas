import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import UserRoles from '../../../../utils/constants/userRoles';
import statusCodes from '../../../../utils/constants/statusCodes';
import checkRoles from '../../../middlewares/checkRole';
import { NotAuthorizedError } from '../../../../errors/NotAuthorizedError';
import { loginMiddleware, logoutMiddleware, verifyJWT, notLoggedInMiddleware } from '../../../middlewares/auth-middlewares';

// import { userInfo } from 'os';
// import { parse } from 'path';

const router = Router();

router.post('/login', notLoggedInMiddleware, loginMiddleware);

router.post('/logout', logoutMiddleware);

router.post('/create', checkRoles([UserRoles.ADMIN, UserRoles.USER]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserService.create(req.body);
		res.status(statusCodes.CREATED).json('Usuário criado com sucesso!');
	} catch (error) {
		next(error);
	}
});

router.get('/id/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readUserByID(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(user);
	} catch (error) {
		next(error);
	}
});

router.get('/email/:email', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserService.readByEmail(req.params.email);
		res.status(statusCodes.SUCCESS).json(user);
	} catch (error) {
		next(error);
	}
});

router.get('/allUsers', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.user.role != UserRoles.ADMIN) {
			throw new NotAuthorizedError('Você não tem permissão para visualizar todos os usuários.');
		}
		const users = await UserService.read();
		res.status(statusCodes.SUCCESS).json(users);
	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.user.role == UserRoles.USER && req.user.id != parseInt(req.params.id)) {
			throw new NotAuthorizedError('Você não tem permissão para deletar outro usuário.');
		}

		await UserService.deleteUser(parseInt(req.params.id));
		res.status(statusCodes.NO_CONTENT).json('Usuário deletado com sucesso!');
	}
	catch (error) {
		next(error);
	}
});

router.put('/update', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.user.id != parseInt(req.body.id)) {
			throw new NotAuthorizedError('Você não tem permissão para atualizar outro usuário.');
		}

		const { id, name, email, photo, password, role } = req.body;
		await UserService.updateUser({ id: parseInt(id), name, email, photo, password, role, });
		res.status(statusCodes.NO_CONTENT).json('Usuário atualizado com sucesso!');
	} catch (error) {
		next(error);
	}
});

export default router;