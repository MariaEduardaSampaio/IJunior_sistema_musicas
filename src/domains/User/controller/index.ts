import { User } from '@prisma/client';
import UserService from '../services/UserService';


export async function createEntities(body: User) {
    try {
        await UserService.create(body)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readUserByID(id: number) {
    try {
        await UserService.readUserByID(id)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readUserByEmail(email: string) {
    try {
        await UserService.readByEmail(email)
    } catch (error) {
        console.log(error)
    }
}

export async function updateUser(body: User) {
    try {
        await UserService.updateUser(body)
    }
    catch (error) {
        console.log(error)
    }
}