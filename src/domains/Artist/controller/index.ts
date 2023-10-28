import ArtistService from '../services/ArtistService';
import { Router, Request, Response, NextFunction } from 'express';
import statusCodes from '../../../../utils/constants/statusCodes';
import UserRoles from '../../../../utils/constants/userRoles';
import { verifyJWT } from '../../../middlewares/auth-middlewares';
import { NotAuthorizedError } from '../../../../errors/NotAuthorizedError';
const router = Router();

function verifyAdmin(req: Request, res: Response, next: NextFunction, messageError: string) {
	if (req.user.role !== UserRoles.ADMIN) {
		throw new NotAuthorizedError(messageError);
	}
	next();
}

router.post('/create', verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		const messageError = 'Você não tem permissão para criar um artista';
		verifyAdmin(req, res, next, messageError);
		await ArtistService.createArtist(req.body);
		res.status(statusCodes.CREATED).json('Artista criado com sucesso!');
	}
	catch (error) {
		next(error);
	}
});


router.put('/update', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const messageError = 'Você não tem permissão para atualizar um artista';
		verifyAdmin(req, res, next, messageError);

		const { streams, id, ...rest } = req.body;
		await ArtistService.updateArtist({ id: parseInt(id), streams: parseInt(streams), ...rest });
		res.sendStatus(statusCodes.NO_CONTENT).json('Artista atualizado com sucesso!');
	}
	catch (error) {
		next(error);
	}
});

router.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const messageError = 'Você não tem permissão para buscar um artista por id';
		verifyAdmin(req, res, next, messageError);

		const artists = await ArtistService.readArtistByID(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(artists);
	}
	catch (error) {
		next(error);
	}
});

router.get('/name/:name', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const artists = await ArtistService.readArtistByName(String(req.params.name));
		res.status(statusCodes.SUCCESS).json(artists);
	}
	catch (error) {
		next(error);
	}
});

router.get('/allArtists', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const artists = await ArtistService.readAllArtists();
		res.status(statusCodes.SUCCESS).json(artists);
	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const messageError = 'Você não tem permissão para deletar um artista';
		verifyAdmin(req, res, next, messageError);

		await ArtistService.deleteArtist(parseInt(req.params.id));
		res.status(statusCodes.NO_CONTENT).json('Artista deletado com sucesso!');
	} catch (error) {
		next(error);
	}
});

export default router;