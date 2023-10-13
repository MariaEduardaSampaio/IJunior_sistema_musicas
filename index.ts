import { User } from "@prisma/client";
import { CriarEntidades } from "./controller/UserController";


async function main() {
    
    const body = {

        email: 'test@hotmail.com',
        name: 'teste',
        role: 'ADMIN',
        password: 'oioi',
        photo: null,
        id: 0,
    }

    const user = await CriarEntidades(body);
    console.log(user);
    
    // const user = await UserService.create(body);
    // console.log(user);
}
