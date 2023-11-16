import prisma from '../../../../config/client';
import { Artist } from '@prisma/client';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';

class ArtistService {
	async createArtist(body: Artist) {
		if (body.streams < 0) {
			throw new InvalidParamError('Streams não pode ser menor que 0.');
		}

		if (isNaN(body.streams)) {
			throw new InvalidParamError('Streams deve ser um número.');
		}

		if (body.streams > Number.MAX_SAFE_INTEGER) {
			throw new InvalidParamError('Streams excede o valor máximo permitido.');
		}

		if (body.name.trim() === '') {
			throw new InvalidParamError('Nome de artista não pode estar vazio.');
		}

		const createArtist: Artist = await prisma.artist.create({
			data: {
				name: body.name,
				photo: body.photo,
				streams: Number(body.streams),
			}
		});
		return createArtist;

	}

	async readArtistByID(id: number) {
		if (isNaN(id)) {
			throw new InvalidParamError('ID deve ser um número.');
		}

		const artistID = await prisma.artist.findUnique({
			where: { id }
		});

		if (artistID === null) {
			throw new InvalidParamError('Artista não encontrado.');
		}

		return artistID;
	}

	async readArtistByName(name: string) {
		if (name === '') {
			throw new InvalidParamError('Nome não pode ser vazio.');
		}

		const artists = await prisma.artist.findMany({
			where: { name }
		});

		if (artists.length == 0) {
			throw new InvalidParamError('Nenhum artista encontrado com o nome fornecido.');
		}

		return artists;
	}

	async readAllArtists() {
		const artists = await prisma.artist.findMany();

		if (artists.length === 0) {
			throw new QueryError('Não foi encontrado nenhum artista.');
		}

		return artists;
	}

	async deleteArtist(id: number) {
		const existeArtist = await prisma.artist.findUnique({ where: { id } });
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