import { Artist } from '@prisma/client';
import ArtistService from './ArtistService';

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

			const createdArtist = await ArtistService.createArtist(invalidArtist);

			expect(createdArtist).rejects.toThrow('Streams não pode ser menor que 0');
		});

	test('streams é NaN => lança exceção',
		async () => {
			const invalidArtist = {
				name: 'Maria',
				photo: 'photo.jpg',
				streams: NaN,
			} as Artist;

			const createdArtist = await ArtistService.createArtist(invalidArtist);

			expect(createdArtist).rejects.toThrow('Streams deve ser um número.');
		});

	test('nome é vazio => lança exceção',
		async () => {
			const invalidArtist = {
				name: '',
				photo: 'photo.jpg',
				streams: 1000,
			} as Artist;

			const createdArtist = await ArtistService.createArtist(invalidArtist);

			expect(createdArtist).rejects.toThrow('Nome de artista não pode estar vazio.');
		});

	test('streams é o maior que o valor máximo permitido => lança exceção',
		async () => {
			const invalidArtist = {
				name: 'Matheus',
				photo: 'photo.jpg',
				streams: Number.MAX_SAFE_INTEGER + 1,
			} as Artist;

			const createdArtist = await ArtistService.createArtist(invalidArtist);

			expect(createdArtist).rejects.toThrow('Streams excede o valor máximo permitido.');
		});

	test('passa os argumentos corretos => cria Artist',
		async () => {
			const validArtist = {
				name: 'José',
				photo: 'photo.jpg',
				streams: 600000,
			} as Artist;

			const createdArtist = await ArtistService.createArtist(validArtist);

			expect(createdArtist).toEqual(validArtist);
		});
});

describe('readArtistByID', () => {
	test('ID é NaN => lança exceção',
		async () => {

		});

	test('ID é null => lança exceção',
		async () => {

		});
	test('ID é válido => retorna um artista',
		async () => {

		});
}); // duda

describe('readArtistByName', () => {
	test('Name não é uma string => lança exceção',
		async () => {

		});

	test('Name é null => lança exceção',
		async () => {

		});
	test('Name é válido => retorna um artista',
		async () => {

		});
}); // duda

describe('readAllArtists', () => { });

describe('deleteArtist', () => { });

describe('updateArtist', () => { });
