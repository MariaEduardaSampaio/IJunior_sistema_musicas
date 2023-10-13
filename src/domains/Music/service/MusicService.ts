import prisma from '../../../../client/client'
import { Music } from '@prisma/client'


class MusicService {
	async deleteMusic(body: Music) {
		const deletedMusic = await prisma.user.delete({
			where: { id: body.id}
		});
        return deletedMusic;
	}

}
export default new MusicService();