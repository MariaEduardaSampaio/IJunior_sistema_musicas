import prisma from '../../../../config/client';
import { Music } from '@prisma/client';
import MusicService from './MusicService';
import { QueryError } from '../../../../errors/QueryError';
import { InvalidParamError } from '../../../../errors/InvalidParamError';

describe('createMusic', () => {

});

describe('readAll', () => {

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('existe pelo menos uma música cadastrada ==> Retorna elas', async() =>{
		// ARRANGE

		const mockMusics = [
			{
				id: 1,
				name: 'Your Song',
				genre: 'Pop',
				album: 'Elton John',	
				artistId: 1,
			},
			{
				id: 2,
				name: 'Rocket Man',
				genre: 'Pop',
				album: 'Elton John',
				artistId: 1,
			},
			{
				id: 3,
				name: 'In the End',
				genre: 'Rock',
				album: 'Hybrid Theory',
				artistId: 2,
			}
		] as Music[];

		const findManySpy = jest.spyOn(prisma.music, 'findMany')
			.mockResolvedValue(mockMusics);

		// ACT
		const musics = await MusicService.readAll();

		// ASSERT
		expect(musics).toEqual(mockMusics);

		expect(findManySpy).toHaveBeenCalledTimes(1);
	});

	test('não existe nenhuma música cadastrada ==> Lança erro de Query', async() =>{
		// ARRANGE
		const mockMusics = [] as Music[];

		jest.spyOn(prisma.music, 'findMany')
			.mockResolvedValue(mockMusics);

		// ACT & ASSERT
		return expect(
			() => MusicService.readAll()
		).rejects.toThrow(new QueryError('Nenhuma música encontrada.'));
		
	});

});

describe('readByName', () => { });

describe('readById', () => { });

describe('updateMusic', () => {

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('a musica passada como parametro não existe ==> Lança erro de Query', async() =>{
		// ARRANGE
		const mockMusic = {
			id: 1,
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',	
			artistId: 1,
		} as Music;

		// Default value when the music doesn't exist 
		jest.spyOn(prisma.music, 'findUnique')
			.mockResolvedValue(null);

		// ACT & ASSERT
		return expect(
			() => MusicService.updateMusic(mockMusic)
		).rejects.toThrow(new QueryError('Música não encontrada.'));
		
	});

	test('a musica passada como parametro existe ==> Atualiza ela', async() =>{
		// ARRANGE
		const mockMusic = {
			id: 1,
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',	
			artistId: 1,
		} as Music;

		const findUniqueSpy = jest.spyOn(prisma.music, 'findUnique')
			.mockResolvedValue(mockMusic);

		// Retornamos o proprio mockMusic
		const updateSpy = jest.spyOn(prisma.music, 'update')
			.mockResolvedValue(mockMusic);

		// ACT
		const updatedMusic = await MusicService.updateMusic(mockMusic);


		// ASSERT	
		expect(updatedMusic).toEqual(mockMusic);

		expect(findUniqueSpy).toHaveBeenCalledWith({
			where: {
				id: mockMusic.id,
			},
		});
		expect(findUniqueSpy).toHaveBeenCalledTimes(1);

		expect(updateSpy).toHaveBeenCalledWith({
			data: {
				name: mockMusic.name,
				genre: mockMusic.genre,
				album: mockMusic.album,
			},
			where: { id: mockMusic.id }
		});
		expect(updateSpy).toHaveBeenCalledTimes(1);
	});

	test('id da musica é nulo ==> Lança erro de InvalidParam', async() =>{

		// ARRANGE
		const mockMusic = {
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',	
			artistId: 1,
		} as Music;

		// ACT & ASSERT
		return expect(
			() => MusicService.updateMusic(mockMusic)
		).rejects.toThrow(new InvalidParamError('ID não informado.'));

	});

});

describe('deleteMusic', () => { 

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('a musica passada como parametro não existe ==> Lança erro de Query', async() =>{
		// ARRANGE
		const mockMusic = {
			id: 1,
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',	
			artistId: 1,
		} as Music;


		jest.spyOn(prisma.music, 'findUnique')
			.mockResolvedValue(null);

		// ACT & ASSERT
		return expect(
			() => MusicService.deleteMusic(mockMusic.id)
		).rejects.toThrow(new QueryError('Música não encontrada.'));
	});

	test('a musica passada como parametro existe ==> Deleta ela', async() =>{
		// ARRANGE
		const mockMusic = {
			id: 1,
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',	
			artistId: 1,
		} as Music;

		const findUniqueSpy = jest.spyOn(prisma.music, 'findUnique')
			.mockResolvedValue(mockMusic);

		const deleteSpy = jest.spyOn(prisma.music, 'delete')
			.mockResolvedValue(mockMusic);

		// ACT
		const deletedMusic = await MusicService.deleteMusic(mockMusic.id);

		// ASSERT
		expect(findUniqueSpy).toHaveBeenCalledWith({
			where: {
				id: mockMusic.id,
			},
		});
		expect(findUniqueSpy).toHaveBeenCalledTimes(1);
		
		expect(deleteSpy).toHaveBeenCalledWith({
			where: { id: mockMusic.id }
		});
		expect(deleteSpy).toHaveBeenCalledTimes(1);
		
		expect(deletedMusic).toEqual(mockMusic);
	});

	test('id da musica é nulo ==> Lança erro de InvalidParam', async() =>{
		
		// ARRANGE
		const mockMusic = {
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',	
			artistId: 1,
		} as Music;

		// ACT & ASSERT
		return expect(
			() => MusicService.deleteMusic(mockMusic.id)
		).rejects.toThrow(new InvalidParamError('ID não informado.'));

	});

});
