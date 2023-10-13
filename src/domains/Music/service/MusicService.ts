import prisma from '../../../../client/client'
import { Music } from '@prisma/client'


class MusicService {

	async readByName(name : string){
		const musics = await prisma.music.findMany({
			where: { name }
		});
		return musics;
	}

	async readById(id : number){
		const music = await prisma.music.findFirst({
			where: { id }
		});
		return music;
	}

	async deleteMusic(body: Music) {
		const deletedMusic = await prisma.user.delete({
			where: { id: body.id}
		});
        return deletedMusic;
	}

}
export default new MusicService();