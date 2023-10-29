import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { QueryError } from '../../../../errors/QueryError';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
class UserService {
	async encryptPassword(password: string) {
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(password, salt);
		return encryptedPassword;
	}

	async create(body: User) {
		const user = await prisma.user.findUnique({ where: { email: body.email } });

		if (user) {
			throw new QueryError('Email já cadastrado!');
		} else {
			body.password = await this.encryptPassword(body.password);
			const user = await prisma.user.create({
				data: {
					email: body!.email,
					name: body!.name,
					password: body!.password,
					photo: body.photo,
					role: body!.role,
				}

			});
			return user;
		}
	}

	async deleteUser(id: number) {
		if (id === undefined) {
			throw new InvalidParamError('ID não pode ser vazio.');
		}

		const user = await prisma.user.delete({
			where: { id }
		});

		if (user === null) {
			throw new QueryError('Usuário não encontrado.');
		}
		return user;
	}


	async readUserByID(id: number) {
		if (id === undefined) {
			throw new InvalidParamError('ID não pode ser vazio.');
		}

		const user = await prisma.user.findUnique({
			where: { id }
		});

		if (user === null) {
			throw new QueryError('Usuário não encontrado.');
		}
		return user;
	}

	async readByEmail(email: string) {
		if (email === undefined) {
			throw new InvalidParamError('Email não pode ser vazio.');
		}

		const user = await prisma.user.findUnique({
			where: { email }
		});

		if (user === null) {
			throw new QueryError('Usuário não encontrado.');
		}
		return user;
	}

	async read() {
		const users = await prisma.user.findMany();
		return users;
	}

	async updateUser(body: User) {

		if (body.password) body.password = await this.encryptPassword(body.password);

		const existeUser = await prisma.user.findUnique({ where: { email: body.email } });
		if (existeUser) {
			throw new QueryError('Email já cadastrado!');
		}

		const user = await prisma.user.update({
			data: {
				name: body!.name,
				email: body!.email,
				photo: body.photo,
				password: body!.password,
				role: body!.role,
			},
			where: { id: body.id }
		});
		return user;
	}

}
export default new UserService();