import { Music } from '@prisma/client';
import MusicService from '../service/MusicService';


export async function createMusic(body: Music, id: number) {
    try {
        await MusicService.createMusic(body, id)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readMusicByName (name: string) {
    try {
        await MusicService.readByName(name)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readMusicByID (id: number) {
    try {
        await MusicService.readById(id)
    }
    catch (error) {
        console.log(error)
    }
}

export async function updateMusic(body: Music) {
    try {
        await MusicService.updateMusic(body)
    }
    catch (error) {
        console.log(error)
    }
}

export async function deleteMusic(body: Music) {
    try {
        await MusicService.deleteMusic(body.id)
    }
    catch (error) {
        console.log(error)
    }

}