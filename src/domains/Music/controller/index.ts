import MusicService from '../services/MusicService';
import statusCodes from '../../../../utils/constants/statusCodes';
import { Router, Request, Response, NextFunction } from 'express';
import checkRoles from '../../../middlewares/checkRole';
import UserRoles from '../../../../utils/constants/userRoles';
import { verifyJWT } from '../../../middlewares/auth-middlewares';
// import { NotAuthorizedError } from '../../../../errors/NotAuthorizedError';

const router = Router();

router.put('/update', verifyJWT, checkRoles([UserRoles.ADMIN, UserRoles.USER]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, artistId, ...rest } = req.body;
		await MusicService.updateMusic({ id: parseInt(id), artistId: parseInt(artistId), ...rest });
		res.status(statusCodes.SUCCESS).json('Música atualizada com sucesso!');
	} catch (error) {
		next(error);
	}
});

router.get('/allMusics', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.readAll();
		res.status(statusCodes.SUCCESS).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.get('/name/:name', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.readByName(req.params.name);
		res.status(statusCodes.SUCCESS).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.get('/id/:id', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {

	try {
		const musics = await MusicService.readById(parseInt(req.params.id));
		res.status(statusCodes.SUCCESS).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.post('/create', verifyJWT, checkRoles([UserRoles.ADMIN, UserRoles.USER]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		await MusicService.createMusic(req.body, parseInt(req.body.artistId));
		res.status(statusCodes.CREATED).json('Música criada com sucesso!');

	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', verifyJWT, checkRoles([UserRoles.ADMIN]), async (req: Request, res: Response, next: NextFunction) => {

	try {
		await MusicService.deleteMusic(parseInt(req.params.id));
		res.status(statusCodes.SUCCESS).json('Música deletada com sucesso!');
	}
	catch (error) {
		next(error);
	}
});


export default router;