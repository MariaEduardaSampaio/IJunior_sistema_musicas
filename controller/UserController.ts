import { User } from '@prisma/client';
import UserService from '../src/domains/User/services/UserService';


export async function CriarEntidades(body: User) {
    try {
        await UserService.create(body)
       } 
       catch (error) 
       {
        console.log(error)
       }
           
}
