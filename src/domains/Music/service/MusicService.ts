import prisma from '../../../../config/client';
import { Music } from '@prisma/client';


class MusicService {

	async createMusic(body: Music, id: number){
		const createMusic = await prisma.music.create({ 
			data:{
				name: body.name,
				genre: body.genre,
				album: body.album,
				artist:{
					connect:{
						id: id
					}
				}
			}
		});
		return createMusic;

	}

	async readByName(name : string){
		const musics = await prisma.music.findMany({
			where: { name }
		});
		return musics;
	}

	async readById(id : number){
		const music = await prisma.music.findUnique({
			where: { id }
		});
		return music;
	}

	async updateMusic(body: Music) {
		const user = await prisma.music.update({
			data: {
				name: body.name,
				genre: body.genre,
				album: body.album,
			},
			where: { id: body.id }
		});
		return user;
	}

	async deleteMusic(id: number) {
		const deletedMusic = await prisma.music.delete({
			where: { id }
		});
		return deletedMusic;
	}
}
export default new MusicService();