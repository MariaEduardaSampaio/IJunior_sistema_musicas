import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { QueryError } from '../../../../errors/QueryError';

class UserService {
	async encryptPassword(password: string) {
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(password, salt);
		return encryptedPassword;
	}

	async create(body: User) {
		const userEmail = await prisma.user.findUnique({ where: { email: body.email } });

		if (userEmail) {
			throw new QueryError('Email já cadastrado!');
		}

		body.password = await this.encryptPassword(body.password);
		const createdUser = {
			email: body!.email,
			name: body!.name,
			password: body!.password,
			photo: body.photo,
			role: body!.role,
		} as User;

		const user = await prisma.user.create({ data: createdUser });
		return user;

	}

	async deleteUser(id: number) {
		const existeUser = await prisma.user.findUnique({ where: { id } });
		if (existeUser === null) {
			throw new QueryError('Usuário não encontrado.');
		}

		const user = await prisma.user.delete({
			where: { id }

		});
		return user;
	}


	async readUserByID(id: number) {
		const existeUser = await prisma.user.findUnique({ where: { id } });
		if (existeUser === null) {
			throw new QueryError('Usuário não encontrado.');
		}

		const user = await prisma.user.findUnique({
			where: { id }
		});

		return user;
	}

	async readByEmail(email: string) {
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
		if (!existeUser) {
			throw new QueryError('Não é possível mudar o email.');
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