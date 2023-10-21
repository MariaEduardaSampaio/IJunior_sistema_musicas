import { Music } from '@prisma/client';
import MusicService from '../service/MusicService';
// import { Artist } from '@prisma/client';

import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

export async function createMusic(body: Music, id: number) {
	try {
		return await MusicService.createMusic(body, id);
	}
	catch (error) {
		console.log(error);
	}
}

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

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {

	try {
		const musics = await MusicService.deleteMusic(parseInt(req.params.id));
		res.status(200).json(musics);
	}
	catch (error) {
		next(error);
	}
});


export async function updateMusic(body: Music) {
	try {
		return await MusicService.updateMusic(body);
	}
	catch (error) {
		console.log(error);
	}
}

export async function deleteMusic(id: number) {
	try {
		return await MusicService.deleteMusic(id);
	}
	catch (error) {
		console.log(error);
	}

}

export default router;