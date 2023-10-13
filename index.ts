import { User } from "@prisma/client";
import { CriarEntidades } from "./controller/UserController";


async function main() {
    
    const body = {
        email: 'teste@dominio.com',
        name: 'teste',
        role: 'ADMIN',
        password: 'oioi',
    }as User

    const user = await CriarEntidades(body);
    console.log(user);
    
    // const user = await UserService.create(body);
    // console.log(user);
}
