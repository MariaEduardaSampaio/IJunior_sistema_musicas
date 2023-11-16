import prisma from '../../../../config/client';
import { Music } from '@prisma/client';
import MusicService from './MusicService';
import { QueryError } from '../../../../errors/QueryError';
import { InvalidParamError } from '../../../../errors/InvalidParamError';

describe('createMusic', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test ('passa musica já cadastrada => Lança Query Error', async () => {
		// ARRANGE
		const mockMusic = {
			id: 1,
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',	
			artistId: 1,
		} as Music;

		const findFirstSpy = jest.spyOn(prisma.music, 'findFirst')
			.mockResolvedValue(mockMusic);

		// ACT & ASSERT
		return expect(
			() => MusicService.createMusic(mockMusic, mockMusic.artistId)
		).rejects.toThrow(new QueryError('Música já cadastrada.'));
	});

	test('passa argumentos válidos => cria a música', async () => {
		const validMusic = {
			id: 1,
			name: 'Your Song',
			genre: 'Pop',
			album: 'Elton John',
			artistId: 1,
		} as Music;
	
		const createSpy = jest.spyOn(prisma.music, 'create').mockResolvedValue(validMusic);
	
		// ACT
		const createdMusic = await MusicService.createMusic(validMusic, validMusic.artistId);
	
		// ASSERT
		expect(createSpy).toHaveBeenCalledWith({
			data: {
				name: validMusic.name,
				genre: validMusic.genre,
				album: validMusic.album,
				artist: {
					connect: {
						id: validMusic.artistId,
					},
				},
			},
		});
		expect(createSpy).toHaveBeenCalledTimes(1);
	
		// Use expect diretamente, sem resolves
		expect(createdMusic).toEqual(validMusic);
	});
	

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

describe('readByName', () => { 
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('nome é vazio => lança exceção',
		async () => {
			const invalidMusic = {
				id: 1,
				name: '',
				genre: 'Pop',
				album: 'Elton John',
				artistId: 1,
			} as Music;

			const findManySpy = jest.spyOn(prisma.music, 'findMany').mockResolvedValue([]);

			expect(MusicService.readByName(invalidMusic.name))
				.rejects.toThrow(new InvalidParamError('Nome não pode ser vazio.'));
		});

		test('nome é válido => retorna uma lista de músicas',
			async () => {
				const music1 = {
					id: 1,
					name: 'Your Song',
					genre: 'Pop',
					album: 'Elton John',
					artistId: 1,
				} as Music;

				const music2 = {
					id: 2,
					name: 'Your Name',
					genre: 'Pop',
					album: 'Elton John',
					artistId: 1,
				} as Music;

				const findManySpy = jest.spyOn(prisma.music, 'findMany').mockResolvedValue([
					music1, music2]);

				return expect(MusicService.readByName('Your')).resolves.toEqual([music1, music2]);

			});

		test('Não existe música com este nome => lança uma exceção',
		async () => {
			jest.spyOn(prisma.music, 'findMany').mockResolvedValue([]);
			
		return await expect(MusicService.readByName('Ausente'))
			.rejects.toThrow(new InvalidParamError('Nenhuma música com esse ID encontrado.'));

});

});

describe('readById', () => { 
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});
	
	test('Não existe música com o ID passado => lança exceção',
		async () => {
			const invalidID = 2;
			const invalidMusic = {
				id: 1,
				name: 'nome da musica',
				genre: 'genero',
				album: 'nome do album',	
				artistId: 1,
			} as Music;
	
			const findUniqueSpy = jest.spyOn(prisma.music, 'findUnique').mockRejectedValue(null);
	
			const music = await MusicService.readById(invalidID);
	
			expect(findUniqueSpy).toHaveBeenCalledWith(invalidMusic.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(music).rejects.toThrow('Música com este ID não foi encontrada.');
		});
	
	test('ID não é um número inteiro => lança exceção',
		async () => {
			const invalidMusic = {
				id: 4.2,
				name: 'nome da musica',
				genre: 'genero',
				album: 'nome do album',
				artistId: 1,
			} as Music;
	
			const music = await MusicService.readById(invalidMusic.id);
	
			expect(music).rejects.toThrow('ID deve ser um número válido.');
		});
	
	test('ID é um número válido que existe no banco => retorna música',
		async () => {
			const validMusic = {
				id: 1,
				name: 'nome da musica',
				genre: 'genero',
				album: 'nome do album',	
				artistId: 1,
			} as Music;
	
			const findUniqueSpy = jest.spyOn(prisma.music, 'findUnique').mockResolvedValue(validMusic);
	
			const music = await MusicService.readById(validMusic.id);
	
			expect(findUniqueSpy).toHaveBeenCalledWith(validMusic.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(music).toBe(validMusic);
		});
	});
	

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
