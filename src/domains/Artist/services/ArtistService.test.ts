describe('createArtist', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('streams é menor que 0 => lança exceção',
		async () => {

		});

	test('streams é undefined / vazio => lança exceção',
		async () => {

		});

	test('streams é NaN => lança exceção',
		async () => {

		});

	test('nome é undefined / vazio => lança exceção',
		async () => {

		});

	test('passa os argumentos corretos => cria Artist',
		async () => {

		});
}); // duda

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
