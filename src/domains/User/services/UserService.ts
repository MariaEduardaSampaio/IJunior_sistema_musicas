import prisma from '../../../../client/client'
import { User } from '@prisma/client'


class UserService {
	async create(body: User) {
		const user = await prisma.user.create({
			data: {
				email: body.email,
				name: body.name,
				password: body.password,
				photo: body.photo,
				role: body.role,
			}
		});

		return user;
	}

	async deleteUser(body: User){
		const user = await prisma.user.delete({
			where:{id: body.id}
		});
		return user;
	}


	async readUser(body: User) {
		const user = await prisma.user.findUnique({
			where: { id: body.id }
		});
		return user;
	}

	async readByEmail(email : string) {
		const user = await prisma.user.findFirst({
			where: {email}
		});
		return user;
	}

	// async read() {
	// 	const users = await prisma.user.findMany();
	// 	return users;
	// }

	async updateUser(body: User) {
		const user = await prisma.user.update({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				password: body.password,
				role: body.role,
			},
			where: { id: body.id }
		})
		return user;
	}

}
export default new UserService();