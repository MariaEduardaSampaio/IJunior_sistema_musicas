import prisma from '../../../../client/client'
import { Artist } from '@prisma/client'


class ArtistService {
	async readArtist(body: Artist) {
		const artist = await prisma.artist.findUnique({
			where: { id: body.id}
		});
        return artist;
	}

}
export default new ArtistService();