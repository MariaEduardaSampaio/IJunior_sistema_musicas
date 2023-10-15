import { User } from '@prisma/client';
import UserService from '../services/UserService';


export async function createUser(body: User) {
    try {
        return await UserService.create(body)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readUserByID(id: number) {
    try {
        return await UserService.readUserByID(id)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readUserByEmail(email: string) {
    try {
        return await UserService.readByEmail(email)
    } catch (error) {
        console.log(error)
    }
}

export async function updateUser(body: User) {
    try {
        return await UserService.updateUser(body)
    }
    catch (error) {
        console.log(error)
    }
}

export async function deleteUser(id: number) {
    try {
        return await UserService.deleteUser(id)
    }
    catch (error) {
        console.log(error)
    }
}