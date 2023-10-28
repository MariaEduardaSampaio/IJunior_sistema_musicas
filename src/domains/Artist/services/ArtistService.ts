import prisma from '../../../../config/client';
import { Artist } from '@prisma/client';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';

class ArtistService {
	async createArtist(body: Artist) {
		if (body.streams < 0) {
			throw new InvalidParamError('Streams não pode ser menor que 0');
		}
		const createArtist = await prisma.artist.create({
			data: {
				name: body.name,
				photo: body.photo,
				streams: Number(body.streams),
			}
		});
		return createArtist;

	}

	async readArtistByID(id: number) {
		const artistID = await prisma.artist.findUnique({
			where: { id }
		});

		if (artistID === null) {
			throw new InvalidParamError('Artista não encontrado');
		}

		return artistID;
	}


	async readArtistByName(name: string) {
		const artist = await prisma.artist.findMany({
			where: { name }
		});

		if (artist === null) {
			throw new InvalidParamError('Artista não encontrado');
		}

		return artist;
	}

	async readAllArtists() {
		const artists = await prisma.artist.findMany();

		if (artists === undefined) {
			throw new QueryError('Erro ao buscar todos os artistas');
		}

		return artists;
	}

	async deleteArtist(id: number) {
		const artist = await prisma.artist.delete({
			where: { id }
		});

		if (artist === null) {
			throw new InvalidParamError('Artista não encontrado');
		}

		return artist;
	}

	async updateArtist(body: Artist) {
		const artist = await prisma.artist.update({
			data: {
				name: body.name,
				photo: body.photo,
				streams: Number(body.streams),
			},
			where: { id: body.id }
		});
		if (artist === null) {
			throw new InvalidParamError('Artista não encontrado');
		}

		if (body === artist) {
			throw new InvalidParamError('Nenhum dado foi alterado');
		}

		return artist;
	}

}
export default new ArtistService();