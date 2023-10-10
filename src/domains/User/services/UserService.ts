import prisma from '../../../../client/client'

class UserService {
    async create(body: any) {
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
}

export default new UserService();