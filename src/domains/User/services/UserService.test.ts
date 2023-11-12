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
			const invalidUser = {
				id: 1,
				email: 'tobias@hotmail.com',
				name: 'tobias',
				password: '#tobias123#',
				photo: 'tobias.jpg',
				role: 'admin',
			} as User;

			const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(null);

			const deletedUser = await UserService.deleteUser(invalidID);

			expect(findUniqueSpy).toHaveBeenCalledWith(invalidUser.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(deletedUser).rejects.toThrow('Usuário com este ID não foi encontrado.');
		});

	test('ID não é um número inteiro => lança exceção',
		async () => {
			const invalidUser = {
				id: 4.2,
				email: 'junior@hotmail.com',
				name: 'Junior',
				password: '#junior123#',
				photo: 'junior.jpg',
				role: 'user',
			} as User;

			const deletedUser = await UserService.deleteUser(invalidUser.id);

			expect(deletedUser).rejects.toThrow('ID deve ser um número válido.');
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

			expect(findUniqueSpy).toHaveBeenCalledWith(validUser.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(deleteSpy).toHaveBeenCalledWith(validUser.id);
			expect(deleteSpy).toHaveBeenCalledTimes(1);
			expect(deletedUser).toBe(validUser);
		});
});

describe('updateUser', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Tenta atualizar o email => lança exceção',
		async () => {
			const mockEncryptedPassword = 'encryptedPassword';
			const mockUser = {
				id: 1,
				email: 'joao@dominio.com',
				name: 'joao',
				password: mockEncryptedPassword,
				role: 'admin',
			} as User;

			const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

			const updatedUser = await UserService.updateUser(mockUser);

			expect(findUniqueSpy).toHaveBeenCalledWith(mockUser.id);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(updatedUser).rejects.toThrow('Não é possível atualizar o email.');
		});

	describe('Não preenche parâmetros obrigatórios => lança exceção',
		async () => {
			const invalidUser = {
				id: 1,
				email: 'email@teste.br',
				name: 'nome do usuário',
				password: 'senha do usuário',
				role: 'user',
			} as User;

			const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(invalidUser);

			test('Não preenche nome => lança exceção',
				async () => {
					invalidUser.name = '';

					const updatedUser = await UserService.updateUser(invalidUser);

					expect(findUniqueSpy).toHaveBeenCalledWith(invalidUser.id);
					expect(findUniqueSpy).toHaveBeenCalledTimes(1);
					expect(updatedUser).rejects.toThrow('Campos obrigatórios não preenchidos.');

				});

			test('Não preenche email => lança exceção',
				async () => {
					invalidUser.email = '';

					const updatedUser = await UserService.updateUser(invalidUser);

					expect(findUniqueSpy).toHaveBeenCalledWith(invalidUser.id);
					expect(findUniqueSpy).toHaveBeenCalledTimes(1);
					expect(updatedUser).rejects.toThrow('Campos obrigatórios não preenchidos.');

				});

			test('Não preenche senha => lança exceção',
				async () => {
					invalidUser.password = '';

					const updatedUser = await UserService.updateUser(invalidUser);

					expect(findUniqueSpy).toHaveBeenCalledWith(invalidUser.id);
					expect(findUniqueSpy).toHaveBeenCalledTimes(1);
					expect(updatedUser).rejects.toThrow('Campos obrigatórios não preenchidos.');

				});

			test('Não preenche cargo => lança exceção',
				async () => {
					invalidUser.role = '';

					const updatedUser = await UserService.updateUser(invalidUser);

					expect(findUniqueSpy).toHaveBeenCalledWith(invalidUser.id);
					expect(findUniqueSpy).toHaveBeenCalledTimes(1);
					expect(updatedUser).rejects.toThrow('Campos obrigatórios não preenchidos.');

				});
		});

	test('Passa os parâmetros corretamente => atualiza usuário',
		async () => {
			const mockEncryptedPassword = 'encryptedPassword';
			const validUser = {
				id: 1,
				email: 'lucas@dominio.com',
				name: 'lucas',
				password: mockEncryptedPassword,
				role: 'admin',
			} as User;

			const findUniqueSpy = jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(validUser);
			const encryptedPasswordSpy = jest.spyOn(UserService, 'encryptPassword').mockResolvedValue(mockEncryptedPassword);
			const updateSpy = jest.spyOn(prisma.user, 'update').mockResolvedValue(validUser);

			const updatedUser = await UserService.updateUser(validUser);

			expect(findUniqueSpy).toHaveBeenCalledWith(validUser.email);
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(encryptedPasswordSpy).toHaveBeenCalledWith(validUser.password);
			expect(encryptedPasswordSpy).toHaveBeenCalledTimes(1);
			expect(updateSpy).toHaveBeenCalledWith({ where: { id: validUser.id }, data: validUser });
			expect(updateSpy).toHaveBeenCalledTimes(1);
			expect(updatedUser).toBe(validUser);
		});
});

describe('readUserByID', () => {

});

describe('readByEmail', () => {

});

describe('encryptPassword', () => {

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
		expect(encryptedPassword).toEqual(mockEncryptedPassword);

		expect(saltSpy).toHaveBeenCalledTimes(1);
		expect(saltSpy).toHaveBeenCalledWith(mockSalt);

		expect(bcryptSpy).toHaveBeenCalledTimes(1);
		expect(bcryptSpy).toHaveBeenCalledWith(mockPassword, mockGenSalt);

	});



});

describe('read', () => {

});