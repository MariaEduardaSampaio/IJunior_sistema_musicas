import { Artist } from '@prisma/client';
import ArtistService from './ArtistService';
import prisma from '../../../../config/client';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from '../../../../errors/QueryError';

describe('createArtist', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('streams é menor que 0 => lança exceção',
		async () => {
			const invalidArtist = {
				name: 'João',
				streams: -10,
			} as Artist;


			return await expect(ArtistService.createArtist(invalidArtist))
				.rejects.toThrow(new InvalidParamError('Streams não pode ser menor que 0.'));
		});

	test('streams é NaN => lança exceção',
		async () => {
			const invalidArtist = {
				name: 'Maria',
				photo: 'photo.jpg',
				streams: NaN,
			} as Artist;

			return await expect(ArtistService.createArtist(invalidArtist))
				.rejects.toThrow(new InvalidParamError('Streams deve ser um número.'));
		});

	test('nome é vazio => lança exceção',
		async () => {
			const invalidArtist = {
				name: '',
				photo: 'photo.jpg',
				streams: 1000,
			} as Artist;


			return await expect(ArtistService.createArtist(invalidArtist))
				.rejects.toThrow(new InvalidParamError('Nome de artista não pode estar vazio.'));
		});

	test('streams é o maior que o valor máximo permitido => lança exceção',
		async () => {
			const invalidArtist = {
				name: 'Matheus',
				photo: 'photo.jpg',
				streams: Number.MAX_SAFE_INTEGER + 1,
			} as Artist;


			return await expect(ArtistService.createArtist(invalidArtist))
				.rejects.toThrow(new InvalidParamError('Streams excede o valor máximo permitido.'));
		});

	test('passa os argumentos corretos => cria Artist',
		async () => {
			const validArtist = {
				name: 'José',
				photo: 'photo.jpg',
				streams: 600000,
			} as Artist;

			jest.spyOn(prisma.artist, 'create').mockResolvedValue(validArtist);

			return expect(ArtistService.createArtist(validArtist)).resolves.toEqual(validArtist);
		});
});

describe('readArtistByID', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('ID é NaN => lança exceção',
		async () => {
			const invalidID = NaN;

			return await expect(ArtistService.readArtistByID(invalidID))
				.rejects.toThrow(new InvalidParamError('ID deve ser um número.'));
		});

	test('ID é válido => retorna um artista',
		async () => {
			const validID = 1;
			const artist = {
				id: validID,
				name: 'Jonathan',
				photo: 'photo.jpg',
				streams: 600000,
			} as Artist;

			jest.spyOn(prisma.artist, 'findUnique').mockResolvedValue(artist);

			const readArtist = await ArtistService.readArtistByID(validID);

			expect(readArtist).toEqual(artist);
		});

	test('Não existe artista com este ID => lança uma exceção',
		async () => {
			jest.spyOn(prisma.artist, 'findUnique').mockResolvedValue(null);

			return await expect(ArtistService.readArtistByID(2))
				.rejects.toThrow(new InvalidParamError('Artista não encontrado.'));
		});
});

describe('readArtistByName', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Name é vazio => lança exceção',
		async () => {
			const invalidArtist = {
				id: 1,
				name: '',
				photo: 'photo.jpg',
				streams: 567000,
			} as Artist;

			jest.spyOn(prisma.artist, 'findMany').mockResolvedValue([]);

			expect(ArtistService.readArtistByName(invalidArtist.name))
				.rejects.toThrow(new InvalidParamError('Nome não pode ser vazio.'));
		});

	test('Name é válido => retorna uma lista de artistas',
		async () => {
			const artist1 = {
				id: 1,
				name: 'Jorge Ben',
				photo: 'photo.jpg',
				streams: 80910000000,
			} as Artist;

			const artist2 = {
				id: 1,
				name: 'Jorge e Mateus',
				photo: 'photo.jpg',
				streams: 800,
			} as Artist;

			jest.spyOn(prisma.artist, 'findMany').mockResolvedValue([artist1, artist2]);

			return expect(ArtistService.readArtistByName('Jorge')).resolves.toEqual([artist1, artist2]);
		});

	test('Não existe artista com este nome => lança uma exceção',
		async () => {
			jest.spyOn(prisma.artist, 'findMany').mockResolvedValue([]);

			return await expect(ArtistService.readArtistByName('Maria'))
				.rejects.toThrow(new InvalidParamError('Nenhum artista encontrado com o nome fornecido.'));
		});
});

describe('readAllArtists', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('existe pelo menos um artista cadastrado ==> Retorna eles', async () => {

		const mockArtists = [
			{
				id: 1,
				name: 'Jorge Ben',
				photo: 'photo.jpg',
				streams: 80910000000,

			},
			{
				id: 2,
				name: 'Jorge e Mateus',
				photo: 'photo.jpg',
				streams: 800,
			}
		] as Artist[];

		const findManySpy = jest.spyOn(prisma.artist, 'findMany')
		.mockResolvedValue(mockArtists);

		const artists = await ArtistService.readAllArtists();

		expect(findManySpy).toHaveBeenCalledTimes(1);
		expect(artists).toEqual(mockArtists);

	});

	test('não existe nenhum artista cadastrado ==> Lança erro de Query', async () => {
		const mockArtists = [] as Artist[];

		jest.spyOn(prisma.artist, 'findMany')
			.mockResolvedValue(mockArtists);

		return expect(
			() => ArtistService.readAllArtists()
		).rejects.toThrow(new QueryError('Não foi encontrado nenhum artista.'));
	});

});

describe('deleteArtist', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('o artista passado como parametro não existe ==> Lança erro de Query', async () => {
		// ARRANGE
		const mockArtist = {
			id: 1,
			name: 'Jorge Ben',
			photo: 'photo.jpg',
			streams: 80910000000,
		} as Artist;

		jest.spyOn(prisma.artist, 'findUnique')
			.mockResolvedValue(null);

		// ACT & ASSERT
		return expect(
			() => ArtistService.deleteArtist(mockArtist.id)
		).rejects.toThrow('Artista não encontrado.');
	});

	test('o artista passado como parametro existe ==> Deleta ele', async () => {
		const mockArtist = {
			id: 1,
			name: 'Jorge Ben',
			photo: 'photo.jpg',
			streams: 80910000000,
		} as Artist;
	
		const findUniqueSpy = jest.spyOn(prisma.artist, 'findUnique')
			.mockResolvedValue(mockArtist);
	
		const deleteSpy = jest.spyOn(prisma.artist, 'delete')
			.mockResolvedValue(mockArtist);
	
		const deletedArtist = await ArtistService.deleteArtist(mockArtist.id);
	
		expect(findUniqueSpy).toHaveBeenCalledWith({
			where: {
				id: mockArtist.id,
			},
		});
		expect(findUniqueSpy).toHaveBeenCalledTimes(1);
		expect(deleteSpy).toHaveBeenCalledWith({
			where: { id: mockArtist.id }
		});
		expect(deleteSpy).toHaveBeenCalledTimes(1);
		expect(deletedArtist).toBe(mockArtist);
	});
	
	


});

describe('updateArtist', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Tenta atualizar o nome do artista => lança exceção',
		async () => {
			const mockArtist = {
				id: 1,
				name: 'guilherme',
				photo: 'photo.jpg',
				streams: 60000,
			} as Artist;

			const findUniqueSpy = jest.spyOn(prisma.artist, 'findUnique').mockResolvedValue(null);

			const updatedArtist = await ArtistService.updateArtist(mockArtist);

			expect(findUniqueSpy).toHaveBeenCalledWith(mockArtist.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(updatedArtist).rejects.toThrow('Não é possível atualizar o nome.');
		});

	test('Não preenche parâmetros obrigatórios => lança exceção',
		async () => {
			const invalidArtist = {
				id: 1,
				name: 'nome do artista',
				photo: 'photo.jpg',
				streams: 60000,
			} as Artist;

			const findUniqueSpy = jest.spyOn(prisma.artist, 'findUnique').mockResolvedValue(invalidArtist);

			invalidArtist.name = '';

			const updatedArtist = await ArtistService.updateArtist(invalidArtist);

			expect(findUniqueSpy).toHaveBeenCalledWith(invalidArtist.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(updatedArtist).rejects.toThrow('Campos obrigatórios não preenchidos.');
		});

	test('Passa os parâmetros corretamente => atualiza artista',
		async () => {
			const validArtist = {
				id: 1,
				name: 'lucas',
				photo: 'photo.jpg',
				streams: 60000,
			} as Artist;

			const findUniqueSpy = jest.spyOn(prisma.artist, 'findUnique').mockResolvedValue(validArtist);
			const updateSpy = jest.spyOn(prisma.artist, 'update').mockResolvedValue(validArtist);

			const updatedArtist = await ArtistService.updateArtist(validArtist);

			expect(findUniqueSpy).toHaveBeenCalledWith(validArtist.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(updateSpy).toHaveBeenCalledWith({ where: { id: validArtist.id }, data: validArtist });
			expect(updateSpy).toHaveBeenCalledTimes(1);
			expect(updatedArtist).toBe(validArtist);
		});

});
