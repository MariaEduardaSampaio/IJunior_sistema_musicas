import ArtistService from '../services/ArtistService';
import { Router, Request, Response, NextFunction } from 'express';
import statusCodes from '../../../../utils/constants/statusCodes';
import { InvalidParamError } from '../../../../errors/InvalidParamError';

const router = Router();


router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.body.name === undefined) {
			throw new InvalidParamError('Nome não pode ser vazio');
		}

		await ArtistService.createArtist(req.body);
		res.status(statusCodes.CREATED).json('Artista criado com sucesso!');
	}
	catch (error) {
		next(error);
	}
});


router.put('/update', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { streams, id, ...rest } = req.body;
		if (req.body.id === undefined) {
			throw new InvalidParamError('ID não pode ser vazio');
		}

		await ArtistService.updateArtist({ id: parseInt(id), streams: parseInt(streams), ...rest });
		res.sendStatus(statusCodes.NO_CONTENT).json('Artista atualizado com sucesso!');
	}
	catch (error) {
		next(error);
	}
});

router.get('/id/:id', async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.params.id === undefined) {
			throw new InvalidParamError('ID não pode ser vazio');
		}

		const artists = await ArtistService.readArtistByID(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(artists);
	}
	catch (error) {
		next(error);
	}
});

router.get('/name/:name', async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.params.name === undefined) {
			throw new InvalidParamError('Nome não pode ser vazio');
		}

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
		if (req.params.id === undefined) {
			throw new InvalidParamError('ID não pode ser vazio');
		}

		await ArtistService.deleteArtist(parseInt(req.params.id));
		res.status(statusCodes.NO_CONTENT).json('Artista deletado com sucesso!');
	} catch (error) {
		next(error);
	}
});



export default router;