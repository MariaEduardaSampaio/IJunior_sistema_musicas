import ArtistService from '../services/ArtistService';

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { streams, id, ...rest } = req.body;

		await ArtistService.updateArtist({ id: parseInt(id), streams: parseInt(streams), ...rest });
		res.sendStatus(201).end();
	}
	catch (error) {
		next(error);
	}
});

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await ArtistService.createArtist(req.body);
		res.json('Artista criado com sucesso');

	} catch (error){
		next(error);
	}
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const artist = await ArtistService.deleteArtist(parseInt(req.params.id));
		res.status(200).json(artist);
	} catch (error) {
		next(error);
	}
});

export default router;