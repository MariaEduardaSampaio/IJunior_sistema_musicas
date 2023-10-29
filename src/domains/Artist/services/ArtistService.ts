import prisma from '../../../../config/client';
import { Artist } from '@prisma/client';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';

class ArtistService {
	async createArtist(body: Artist) {
		if (body.streams < 0) {
			throw new InvalidParamError('Streams não pode ser menor que 0');
		}

		// corrigir: não está barrando valores nulos no create
		const createArtist: Artist = await prisma.artist.create({
			data: {
				name: body!.name,
				photo: body.photo,
				streams: Number(body!.streams),
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
		const existeArtist = await prisma.user.findUnique({ where: { id } });
		if (existeArtist === null) {
			throw new QueryError('Artista não encontrado.');
		}

		const artist = await prisma.artist.delete({
			where: { id }
		});

		return artist;
	}

	async updateArtist(body: Artist) {
		if (body.streams < 0) {
			throw new InvalidParamError('Streams não pode ser menor que 0');
		}
		// corrigir: não está barrando valores nulos no update
		const artist = await prisma.artist.update({
			data: {
				name: body!.name,
				photo: body.photo,
				streams: Number(body!.streams),
			},
			where: { id: body.id }
		});
		return artist;
	}

}
export default new ArtistService();