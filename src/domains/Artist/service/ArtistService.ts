import prisma from '../../../../client/client'
import { Artist } from '@prisma/client'


class ArtistService {
	async readArtist(body: Artist) {
		const artist = await prisma.artist.findMany({
			where: { name: body.name}
		});
        return artist;
	}

}
export default new ArtistService();