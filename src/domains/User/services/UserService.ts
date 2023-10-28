import prisma from '../../../../config/client';
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { QueryError } from '../../../../errors/QueryError';
import { PermissionError } from '../../../../errors/PermissionError';

class UserService {
	async encryptPassword(password: string) {
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(password, salt);
		return encryptedPassword;
	}

	async create(body: User) {

		if (body.role == 'admin') {
			throw new PermissionError('Não é possível criar um usuário com o cargo de administrador!');
		}
		
		body.password = await this.encryptPassword(body.password);
		const user = await prisma.user.findUnique({where: {email: body.email}});
		if(user) {
			throw new QueryError('Email já cadastrado!');
		}else{
			const user = await prisma.user.create({
			data: {
				email: body.email,
				name: body.name,
				password: body.password,
				photo: body.photo,
				role: body.role,
			}
			
			}	
			)
			return user;
	};

		
	}

	async deleteUser(id: number) {
		const user = await prisma.user.delete({
			where: { id }
		});
		return user;
	}


	async readUserByID(id: number) {
		const user = await prisma.user.findUnique({
			where: { id }
		});
		return user;
	}

	async readByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: { email }
		});
		return user;
	}

	async read() {
		const users = await prisma.user.findMany();
		return users;
	}

	async updateUser(body: User) {

		if(body.password) body.password = await this.encryptPassword(body.password);

		const user = await prisma.user.update({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				password: body.password,
				role: body.role,
			},
			where: { id: body.id }
		});
		return user;
	}

}
export default new UserService();