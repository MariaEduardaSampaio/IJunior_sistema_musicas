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


	async updateUser(body: User) {
		const user = await prisma.user.update({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				password: body.password,
				role: body.role,
			},
			where: { id: body.id}
		})
	}
}
export default new UserService();