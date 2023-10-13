import prisma from '../../../../client/client'
import { Music } from '@prisma/client'


class MusicService {
	async updateMusic(body: Music) {
		const user = await prisma.music.update({
			data: {
				name: body.name,
				genre: body.genre,
				album: body.album,
			},
			where: { id: body.id }
		})
		return user;
	}

	async deleteMusic(body: Music) {
		const deletedMusic = await prisma.music.delete({
			where: { id: body.id }
		});
		return deletedMusic;
	}
}
export default new MusicService();