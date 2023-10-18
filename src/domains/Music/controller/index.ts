import { Music } from '@prisma/client';
import MusicService from '../service/MusicService';
// import { Artist } from '@prisma/client';


export async function createMusic(body: Music, id: number) {
	try {
		await MusicService.createMusic(body, id);
	}
	catch (error) {
		console.log(error);
	}
}

export async function readMusicByName (name: string) {
	try {
		await MusicService.readByName(name);
	}
	catch (error) {
		console.log(error);
	}
}

export async function readMusicByID (id: number) {
	try {
		await MusicService.readById(id);
	}
	catch (error) {
		console.log(error);
	}
}

export async function updateMusic(body: Music) {
	try {
		await MusicService.updateMusic(body);
	}
	catch (error) {
		console.log(error);
	}
}

export async function deleteMusic(id: number) {
	try {
		await MusicService.deleteMusic(id);
	}
	catch (error) {
		console.log(error);
	}

}