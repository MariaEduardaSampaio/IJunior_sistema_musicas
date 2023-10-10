import UserService from './src/domains/User/services/UserService';


async function main() {
    const body = {
        email: 'teste@dominio.com',
        name: 'teste',
        role: 'ADMIN',
        password: '654321'
    }

    // const user = await UserService.create(body);
    // console.log(user);
}

main();