import UserService from './UserService';
import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import { QueryError } from '../../../../errors/QueryError';
import bcrypt from 'bcrypt';
import { InvalidParamError } from '../../../../errors/InvalidParamError';

describe('create', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('os dados do usuário são passados como entrada ==> cria esse usuario no banco', async () => {
		// ARRANGE

		const mockEncryptedPassword = 'encryptedPassword';
		const mockPassword = 'password123';

		const mockUser = {
			name: 'Lucas Paulo',
			email: 'lucaspaulo@example.com',
			password: mockPassword,
			photo: 'photo.jpg',
			role: 'ADMIN',
		} as User;

		// .mockResolvedValue é usado quando a função mockada é async
		// A função encryptPassword vai retornar sempre 'encryptedPassword'
		const encryptedPasswordSpy = jest.spyOn(UserService, 'encryptPassword')
			.mockResolvedValue(mockEncryptedPassword);

		// Não temos esse usuario cadastrado no banco
		const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique')
			.mockResolvedValue(null);

		const createSpy = jest.spyOn(prisma.user, 'create')
			.mockResolvedValue({
				...mockUser,
				password: mockEncryptedPassword,
			});

		// ACT
		const createdUser = await UserService.create(mockUser);

		// ASSERT
		expect(findUniqueSpy).toHaveBeenCalledWith({
			where: {
				email: mockUser.email,
			},
		});
		expect(findUniqueSpy).toHaveBeenCalledTimes(1);

		expect(encryptedPasswordSpy).toHaveBeenCalledWith(mockPassword);
		expect(encryptedPasswordSpy).toHaveBeenCalledTimes(1);

		expect(createSpy).toHaveBeenCalledWith({
			data: {
				...mockUser
			},
		});
		expect(createSpy).toHaveBeenCalledTimes(1);

		expect(createdUser).toEqual({
			...mockUser,
			password: mockEncryptedPassword,
		});
	});

	test('email do usuário a ser inserido já existe (mesmo email) ==> lança uma exceção de Query', async () => {
		// ARRANGE
		const mockUser = {
			name: 'Lucas Paulo',
			email: 'lucaspaulo@example.com',
			password: 'password123',
			photo: 'photo.jpg',
			role: 'ADMIN',
		} as User;

		const mockEncryptedPassword = 'encryptedPassword';

		// A função encryptPassword vai retornar sempre 'encryptedPassword'
		jest.spyOn(UserService, 'encryptPassword')
			.mockResolvedValue(mockEncryptedPassword);

		// Temos esse usuario cadastrado no banco
		jest.spyOn(prisma.user, 'findUnique')
			.mockResolvedValue({
				...mockUser,
				id: 1,
			});

		// Não deve ser chamada
		jest.spyOn(prisma.user, 'create')
			.mockResolvedValue({
				...mockUser,
				password: mockEncryptedPassword
			});

		// ACT & ASSERT

		// Esperamos que UserService.create lance uma exceção de QueryError
		return expect(async () => {
			await UserService.create(mockUser);
		}).rejects.toThrow(new QueryError('Email já cadastrado!'));
	});

	test('algum campo obrigatório não foi preenchido ==> lança uma exceção de Query', async () => {
		// ARRANGE
		const mockUser = {} as User;

		// ACT & ASSERT
		expect(async () => { await UserService.create(mockUser); })
			.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

		mockUser.id = 1;
		expect(async () => { await UserService.create(mockUser); })
			.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

		mockUser.email = 'lucas-example@gmail.com';
		expect(async () => { await UserService.create(mockUser); })
			.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

		mockUser.password = 'password123';
		expect(async () => { await UserService.create(mockUser); })
			.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

		mockUser.name = 'Lucas Paulo';
		expect(async () => { await UserService.create(mockUser); })
			.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

	});

	test('usuário com senha vazia ==> lança uma exceção de InvalidParam', async () => {
		// ARRANGE
		const mockUser = {
			name: 'Lucas Paulo',
			email: 'lucas-example@gmail.com',
			password: '',
			photo: 'photo.jpg',
			role: 'ADMIN',
		} as User;

		// ACT & ASSERT
		expect(async () => { await UserService.create(mockUser); })
			.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

	});
});

describe('deleteUser', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Não existe usuário com o ID passado => lança exceção',
		async () => {
			const invalidID = 2;

			await expect(UserService.deleteUser(invalidID))
				.rejects.toThrow(new QueryError('Usuário com este ID não foi encontrado.'));
		});

	test('ID não é um número inteiro => lança exceção',
		async () => {
			const invalidFloatID = 4.2;

			await expect(UserService.deleteUser(invalidFloatID))
				.rejects.toThrow(new InvalidParamError('ID deve ser um número inteiro.'));
		});

	test('ID é um número negativo => lança exceção',
		async () => {
			const invalidNegativeID = -3;

			await expect(UserService.deleteUser(invalidNegativeID))
				.rejects.toThrow(new InvalidParamError('ID deve ser um número positivo ou 0.'));
		});

	test('ID é um número válido que existe no banco => deleta usuário',
		async () => {
			const validUser = {
				id: 1,
				email: 'gustavo@hotmail.com',
				name: 'gustavo',
				password: '#gustavo123#',
				photo: 'gustavo.jpg',
				role: 'admin',
			} as User;

			const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(validUser);
			const deleteSpy = jest.spyOn(prisma.user, 'delete').mockResolvedValue(validUser);

			const deletedUser = await UserService.deleteUser(validUser.id);

			expect(findUniqueSpy).toHaveBeenCalledWith({ where: { id: validUser.id } });
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(deleteSpy).toHaveBeenCalledWith({ where: { id: validUser.id } });
			expect(deleteSpy).toHaveBeenCalledTimes(1);
			expect(deletedUser).toEqual(validUser);
		});
});

describe('updateUser', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Tenta atualizar o email => lança exceção',
		async () => {
			const mockUser = {
				id: 1,
				email: 'joao@dominio.com',
				name: 'joao',
				password: 'senhaForte@#e2',
				role: 'admin',
			} as User;

			await expect(UserService.updateUser(mockUser))
				.rejects.toThrow(new QueryError('Não é possível atualizar o email.'));
		});

	test('Não preenche nome (param. obrigatório) => lança exceção',
		async () => {
			const invalidUser = {
				id: 1,
				email: 'email@teste.br',
				name: '',
				password: 'senha do usuário',
				role: 'user',
			} as User;

			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(invalidUser);

			await expect(UserService.updateUser(invalidUser))
				.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

		});

	test('Não preenche email (param. obrigatório) => lança exceção',
		async () => {
			const invalidUser = {
				id: 1,
				email: '',
				name: 'nome do usuario',
				password: 'senha do usuário',
				role: 'user',
			} as User;

			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(invalidUser);

			await expect(UserService.updateUser(invalidUser))
				.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));

		});

	test('Não preenche senha (param. obrigatório) => lança exceção',
		async () => {
			const invalidUser = {
				id: 1,
				email: 'email@teste.br',
				name: 'nome do usuario',
				password: '',
				role: 'user',
			} as User;

			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(invalidUser);

			await expect(UserService.updateUser(invalidUser))
				.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));
		});

	test('Não preenche cargo (param. obrigatório) => lança exceção',
		async () => {
			const invalidUser = {
				id: 1,
				email: 'email@teste.br',
				name: 'nome do usuario',
				password: 'senha do usuario',
				role: '',
			} as User;

			jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(invalidUser);

			await expect(UserService.updateUser(invalidUser))
				.rejects.toThrow(new InvalidParamError('Campos obrigatórios não preenchidos.'));
		});

	test('Passa os parâmetros corretamente => atualiza usuário',
		async () => {
			const mockEncryptedPassword = 'encryptedPassword';
			const mockPassword = 'password123';
			const validUser = {
				id: 1,
				email: 'lucas@dominio.com',
				name: 'lucas',
				photo: 'photo.jpg',
				password: mockPassword,
				role: 'admin',
			} as User;

			const findUniqueMock = jest.spyOn(prisma.user, 'findUnique')
				.mockResolvedValue(validUser);
			const encryptedPasswordMock = jest.spyOn(UserService, 'encryptPassword')
				.mockResolvedValue(mockEncryptedPassword);
			const updateMock = jest.spyOn(prisma.user, 'update')
				.mockResolvedValue({
					...validUser,
					password: mockEncryptedPassword,
				});

			const updatedUser = await UserService.updateUser(validUser);

			expect(findUniqueMock).toHaveBeenCalledWith({ where: { email: validUser.email }, });
			expect(findUniqueMock).toHaveBeenCalledTimes(1);
			expect(encryptedPasswordMock).toHaveBeenCalledWith(mockPassword);
			expect(encryptedPasswordMock).toHaveBeenCalledTimes(1);
			expect(updateMock).toHaveBeenCalledTimes(1);
			expect(updatedUser).toEqual({
				...validUser,
				password: mockEncryptedPassword,
			});
		});
});

describe('readUserByID', () => {

});

describe('readByEmail', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Email é invalido => lança exceção',
		async () => {
			const invalidEmail = 'invalido@dominio.com';

			await expect(UserService.readByEmail(invalidEmail))
				.rejects.toThrow(new QueryError('Usuário não encontrado.'));
		});

	test('Email é válido => retorna um usuário',
		async () => {
			const validEmail = 'teste@exemplo.com';
			const user = {
				id: 1,
				email: validEmail,
				name: 'nome do usuário',
				password: 'senha do usuário',
				role: 'user',
			} as User;

			const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);
			const readUser = await UserService.readByEmail(validEmail);

			expect(findUniqueSpy).toHaveBeenCalledWith({ where: { email: user.email } });
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(readUser).toEqual(user);
		});

	test('Não existe usuário com este email => lança uma exceção',
		async () => {
			const invalidEmail = 'teste@exemplo.com';

			await expect(UserService.readByEmail(invalidEmail))
				.rejects.toThrow(new QueryError('Usuário não encontrado.'));
		});
});

describe('encryptPassword', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});
	test('a senha é passada como entrada ==> retorna ela criptografada', async () => {
		// ARRANGE
		const mockPassword = 'password123';
		const mockEncryptedPassword = 'encryptedPassword';
		const mockSalt = 10;
		const mockGenSalt = 'mockGenSalt';

		const saltSpy = jest.spyOn(bcrypt, 'genSalt')
			.mockImplementation(() => Promise.resolve(mockGenSalt));

		const bcryptSpy = jest.spyOn(bcrypt, 'hash')
			.mockImplementation(() => Promise.resolve(mockEncryptedPassword));

		// ACT
		const encryptedPassword = await UserService.encryptPassword(mockPassword);

		// ASSERT

		expect(saltSpy).toHaveBeenCalledWith(mockSalt);
		expect(saltSpy).toHaveBeenCalledTimes(1);

		expect(bcryptSpy).toHaveBeenCalledWith(mockPassword, mockGenSalt);
		expect(bcryptSpy).toHaveBeenCalledTimes(1);

		expect(encryptedPassword).toEqual(mockEncryptedPassword);
	});
});

describe('read', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('existe pelo menos um usuário cadastrado ==> Retorna eles', async () => {
		// ARRANGE

		const mockUsers = [
			{
				id: 1,
				email: 'teste@exemplo.com',
				name: 'teste',
				password: 'senha',
				role: 'admin',
			},
			{
				id: 2,
				email: 'teste1@exemplo.com',
				name: 'teste1',
				password: 'senha',
				role: 'user',
			},
			{
				id: 3,
				email: 'teste2@exemplo.com',
				name: 'teste2',
				password: 'senha',
				role: 'admin',
			}
		] as User[];

		const findManySpy = jest.spyOn(prisma.user, 'findMany')
			.mockResolvedValue(mockUsers);

		// ACT
		const users = await UserService.read();

		// ASSERT
		expect(users).toEqual(mockUsers);

		expect(findManySpy).toHaveBeenCalledTimes(1);
	});

	test('não existe nenhum usuário cadastrado ==> Lança erro de Query', async () => {
		const mockUsers = [] as User[];

		jest.spyOn(prisma.user, 'findMany')
			.mockResolvedValue(mockUsers);

		return expect(UserService.read())
			.rejects.toThrow(new QueryError('Não há usuários cadastrados.'));
	});

});