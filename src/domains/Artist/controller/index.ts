import { Artist } from '@prisma/client';
import ArtistService from '../service/ArtistService';

export async function createArtist(body: Artist) {
    try {
        return await ArtistService.createArtist(body)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readArtistByID(id: number) {
    try {
        return await ArtistService.readArtistByID(id)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readArtistByName(name: string) {
    try {
        return await ArtistService.readArtistByName(name)
    }
    catch (error) {
        console.log(error)
    }
}

export async function updateArtist(body: Artist) {
    try {
        return await ArtistService.updateArtist(body)
    }
    catch (error) {
        console.log(error)
    }
}
export async function deleteArtist(id: number) {
    try {
        return await ArtistService.deleteArtist(id)
    }
    catch (error) {
        console.log(error)
    }
}