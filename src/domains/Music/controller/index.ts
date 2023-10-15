import { Music } from '@prisma/client';
import MusicService from '../service/MusicService';

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