import prisma from '../../../../config/client';
import { Music } from '@prisma/client';
import { QueryError } from '../../../../errors/QueryError';


class MusicService {

	async createMusic(body: Music, id: number){
		const musicExist = await prisma.music.findFirst({
			where: {
				name: body.name,
				album: body.album,
				genre: body.genre,
			},
		});

		if (musicExist) {
			throw new QueryError ('Música já cadastrada.');
		}

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

	async readAll(){ 
		const music = await prisma.music.findMany();
		if (music.length === 0) {
			throw new QueryError('Nenhuma música encontrada.');
		}
		return music;
	}

	async readByName(name : string){
		const music = await prisma.music.findMany({
			where: { name }
		});
		if (music.length === 0) {
			throw new QueryError('Nenhuma música com esse ID encontrado.');
		}
		return music;
	}

	async readById(id : number){
		const music = await prisma.music.findUnique({
			where: { id }
		});
		if (music === null) {
			throw new QueryError('Nenhuma música com esse ID encontrado.');
		}
		return music;
	}

	async updateMusic(body: Music) {
		const existMusic = await prisma.music.findUnique({ where: { id: body.id } });
		if (existMusic === null) {
			throw new QueryError('Música não encontrada.');
		}
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
		const existMusic = await prisma.music.findUnique({ where: { id } });
		if (existMusic === null) {
			throw new QueryError('Música não encontrada.');
		}
		const deletedMusic = await prisma.music.delete({
			where: { id }
		});
		return deletedMusic;
	}
}
export default new MusicService();