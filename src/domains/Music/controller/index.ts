import MusicService from '../services/MusicService';
import statusCodes from '../../../../utils/constants/statusCodes';
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.put('/update', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, artistId, ...rest } = req.body;
		await MusicService.updateMusic({ id: parseInt(id), artistId: parseInt(artistId), ...rest });
		res.status(statusCodes.NO_CONTENT).json('Música atualizada com sucesso!');
	} catch (error) {
		next(error);
	}
});

router.get('/allMusics', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.readAll();
		res.status(statusCodes.SUCCESS).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.get('/name/:name', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.readByName(req.params.name);
		res.status(statusCodes.SUCCESS).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {

	try {
		const musics = await MusicService.readById(parseInt(req.params.id));
		res.status(statusCodes.SUCCESS).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await MusicService.createMusic(req.body, parseInt(req.body.artistId));
		res.status(statusCodes.CREATED).json('Musica criada com sucesso!');

	} catch (error) {
		next(error);
	}
});

router.delete('/delete/:id', async (req: Request, res: Response, next: NextFunction) => {

	try {
		const musics = await MusicService.deleteMusic(parseInt(req.params.id));
		res.status(statusCodes.NO_CONTENT).json(musics);
	}
	catch (error) {
		next(error);
	}
});


export default router;