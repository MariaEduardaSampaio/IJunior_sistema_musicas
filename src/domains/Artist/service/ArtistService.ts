import prisma from '../../../../config/client';
import { Artist } from '@prisma/client';


class ArtistService {
	async createArtist(body: Artist) {
		const createArtist = await prisma.artist.create({
			data: {
				name: body.name,
				photo: body.photo,
				streams: body.streams,
			}
		});
		return createArtist;

	}

	async readArtistByID(id: number) {
		const artistID = await prisma.artist.findUnique({
			where: { id }
		});
		return artistID;
	}


	async readArtistByName(name: string) {
		const artist = await prisma.artist.findMany({
			where: { name }
		});
		return artist;
	}


	async deleteArtist(id: number) {
		const deletedArtist = await prisma.artist.delete({
			where: { id }
		});
		return deletedArtist;
	}

	async updateArtist(body: Artist) {
		const artist = await prisma.artist.update({
			data: {
				name: body.name,
				photo: body.photo,
				streams: body.streams,
			},
			where: { id: body.id }
		});
		return artist;
	}

}
export default new ArtistService();