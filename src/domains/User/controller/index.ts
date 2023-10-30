import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import UserRoles from '../../../../utils/constants/userRoles';
import statusCodes from '../../../../utils/constants/statusCodes';
import { NotAuthorizedError } from '../../../../errors/NotAuthorizedError';
import { loginMiddleware, logoutMiddleware, verifyJWT, notLoggedInMiddleware } from '../../../middlewares/auth-middlewares';
import checkRoles from '../../../middlewares/checkRole';

const router = Router();

router.post('/login', notLoggedInMiddleware, loginMiddleware);

router.post('/logout', logoutMiddleware);

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		if(req.body.role == UserRoles.ADMIN && (!req.user || req.user.role != UserRoles.ADMIN)) {
			throw new NotAuthorizedError('Você não tem permissão para criar um usuário com esse cargo.');
		}

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

router.get('/allUsers',verifyJWT, checkRoles([UserRoles.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {
	try {
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

		if(req.user.id == req.body.id){ // Efetuar logout caso o usuário deletado seja o usuário logado
			logoutMiddleware(req, res, next);
		}
		else{
			res.status(statusCodes.NO_CONTENT).json('Usuário deletado com sucesso!');
		}
	}
	catch (error) {
		next(error);
	}
});

router.put('/update', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.user.role != UserRoles.ADMIN && req.user.id != parseInt(req.body.id)) {
			throw new NotAuthorizedError('Você não tem permissão para atualizar outro usuário.');
		}
		if(req.user.role != UserRoles.ADMIN && req.body.role == UserRoles.ADMIN){
			throw new NotAuthorizedError('Você não tem permissão para atualizar o cargo de um usuário.');
		}

		const { id, name, email, photo, password, role } = req.body;
		await UserService.updateUser({ id: parseInt(id), name, email, photo, password, role, });
		res.status(statusCodes.NO_CONTENT).json('Usuário atualizado com sucesso!');
	} catch (error) {
		next(error);
	}
});

export default router;