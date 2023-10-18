// import { User } from "@prisma/client";
import { createEntities } from './controller/UserController';

import Prisma from './config/client';

async function main() {
	
	const body = {

		email: 'test@hotmail.com',
		name: 'teste',
		role: 'ADMIN',
		password: 'oioi',
		photo: null,
		id: 0,
	};

	const user = await createEntities(body);
	console.log(user);
	
	// const user = await UserService.create(body);
	// console.log(user);
}

main()
	.then(() => console.log('Done'))
	.catch((error) => console.error(error))
	.finally( async () => {
		await Prisma.$disconnect();
	});
