import MusicService from '../services/MusicService';
// import { Artist } from '@prisma/client';

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id, artistId, ...rest } = req.body;
		await MusicService.updateMusic({ id: parseInt(id), artistId: parseInt(artistId), ...rest });
		res.status(200).end();
	} catch (error) {
		next(error);
	}
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.readAll();
		res.status(200).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.get('/name/:name', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.readByName(req.params.name);
		res.status(200).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {

	try {
		const musics = await MusicService.readById(parseInt(req.params.id));
		res.status(200).json(musics);
	}
	catch (error) {
		next(error);
	}
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await MusicService.createMusic(req.body, parseInt(req.params.id));
		res.json("Musica criada com sucesso");

	} catch (error){
		next(error);
	}
});

export default router;