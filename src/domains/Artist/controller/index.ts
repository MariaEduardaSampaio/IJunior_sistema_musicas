import { Artist } from '@prisma/client';
import ArtistService from '../service/ArtistService';

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

export async function createArtist(body: Artist) {
	try {
		return await ArtistService.createArtist(body);
	}
	catch (error) {
		console.log(error);
	}
}

export async function readArtistByID(id: number) {
	try {
		return await ArtistService.readArtistByID(id);
	}
	catch (error) {
		console.log(error);
	}
}

export async function readArtistByName(name: string) {
	try {
		return await ArtistService.readArtistByName(name);
	}
	catch (error) {
		console.log(error);
	}
}

router.put('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {streams, id, ...rest} = req.body;

		const artist = await ArtistService.updateArtist({id: parseInt(id), streams: parseInt(streams), ...rest});
		res.sendStatus(204).json(artist);
	}
	catch (error) {
		next(error);
	}
});

export async function deleteArtist(id: number) {
	try {
		return await ArtistService.deleteArtist(id);
	}
	catch (error) {
		console.log(error);
	}
}

export default router;