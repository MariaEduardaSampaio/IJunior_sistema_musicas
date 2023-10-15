import { Artist } from '@prisma/client';
import ArtistService from '../service/ArtistService';

export async function createArtist(body: Artist) {
    try {
        await ArtistService.createArtist(body)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readArtistByID(body: Artist) {
    try {
        await ArtistService.readArtistByID(body.id)
    }
    catch (error) {
        console.log(error)
    }
}

export async function readArtistByName(body: Artist) {
    try {
        await ArtistService.readArtistByName(body.name)
    }
    catch (error) {
        console.log(error)
    }
}

export async function updateArtist(body: Artist) {
    try {
        await ArtistService.updateArtist(body)
    }
    catch (error) {
        console.log(error)
    }
}

export async function deleteArtist(id: number) {
    try {
        await ArtistService.deleteArtist(id)
    }
    catch (error) {
        console.log(error)
    }
}