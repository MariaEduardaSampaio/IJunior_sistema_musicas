import ArtistService from '../services/ArtistService';

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();


router.post('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const artist = await ArtistService.createArtist(req.body);
		res.status(201).json(artist);
	}
	catch (error) {
		next(error);
	}
});


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

router.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const artists = await ArtistService.readArtistByID(Number(req.params.id));
		res.status(200).json(artists);
	}
	catch (error) {
		next(error);
	}
});

router.get('/name/:name', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const artists = await ArtistService.readArtistByName(String(req.params.name));
		res.status(200).json(artists);
	}
	catch (error) {
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