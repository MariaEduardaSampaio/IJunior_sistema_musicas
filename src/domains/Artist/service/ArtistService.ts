import prisma from '../../../../client/client'
import { Artist } from '@prisma/client'


class ArtistService {
	async readArtist(body: Artist) {
		const artist = await prisma.artist.findMany({
			where: { name: body.name }
		});
		return artist;
	}

	async deleteArtist(body: Artist) {
		const deletedArtist = await prisma.artist.delete({
			where: { id: body.id }
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
			where: { id: body.id}
		})
		return artist;
	}

}
export default new ArtistService();