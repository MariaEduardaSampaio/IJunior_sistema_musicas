import Prisma from './config/client';
import { User } from '@prisma/client';

import * as UserController from './src/domains/User/controller/index';


import { Artist } from '@prisma/client';
import * as ArtistController from './src/domains/Artist/controller/index';


import { Music } from '@prisma/client';
import * as MusicController from './src/domains/Music/controller/index';

async function main() {
	const body: User = {
		email: 'test@hotmail.com',
		name: 'teste',
		role: 'ADMIN',
		password: 'oioi',
		photo: null,
		id: 1
	};

	// Cria um novo usuário
	const createdUser = await UserController.createUser(body);
	console.log('Created User:', createdUser);

	// Lê o usuário pelo ID (substitua o número do ID apropriado)
	const userIdToRead = 1; // Substitui pelo ID desejado
	const userById = await UserController.readUserByID(userIdToRead);
	console.log('User by ID:', userById);

	// Lê o usuário pelo email (substitui pelo email apropriado)
	const userEmailToRead = 'test@hotmail.com'; // Substitui pelo email desejado
	const userByEmail = await UserController.readUserByEmail(userEmailToRead);
	console.log('User by Email:', userByEmail);

	// Atualiza o usuário (substitui os dados do corpo apropriados)
	const updatedBody: User = {
		id : 0, // Usa o ID do usuário criado anteriormente
		email: 'updated@hotmail.com',
		name: 'updated',
		role: 'USER', // Atualiza o papel conforme necessário
		password: 'newpassword',
		photo: 'newphoto.jpg', // Atualiza a foto conforme necessário
	};
	const updatedUser = await UserController.updateUser(updatedBody);
	console.log('Updated User:', updatedUser);

	// Deleta o usuário pelo ID (substitui o número do ID apropriado)
	const userIdToDelete = 0; // Usa o ID do usuário criado anteriormente
	const deletedUser = await UserController.deleteUser(userIdToDelete);
	console.log('Deleted User:', deletedUser);

	// Cria um novo artista
	const artistBody: Artist = {
		id: 0,
		name: 'John Doe',
		photo: 'john_doe.jpg',
		streams: 1000000,
	};
	const createdArtist = await ArtistController.createArtist(artistBody);
	console.log('Created Artist:', createdArtist);

	// Lê o artista pelo ID (substitua o ID apropriado)
	const artistIdToRead = 0; // Use o ID do artista criado anteriormente
	const artistById = await ArtistController.readArtistByID(artistIdToRead);
	console.log('Artist by ID:', artistById);

	// Lê o artista pelo nome (substitua o nome apropriado)
	const artistNameToRead = 'John Doe'; // Substitua pelo nome do artista desejado
	const artistByName = await ArtistController.readArtistByName(artistNameToRead);
	console.log('Artist by Name:', artistByName);

	// Deleta o artista pelo ID (substitua o ID apropriado)
	const artistIdToDelete = 0; // Use o ID do artista criado anteriormente
	const deletedArtist = await ArtistController.deleteArtist(artistIdToDelete);
	console.log('Deleted Artist:', deletedArtist);


	const musicBody: Music = {
		id: 0,
		name: 'My Song',
		genre: 'Pop',
		album: 'My Album',
		artistId: 0
	};
	const artistId = 0; 
	const createdMusic = await MusicController.createMusic(musicBody, artistId);
	console.log('Created Music:', createdMusic);

	// Lê a música pelo nome (substitua o nome apropriado)
	const musicNameToRead = 'My Song'; // Substitua pelo nome da música desejada
	const musicByName = await MusicController.readMusicByName(musicNameToRead);
	console.log('Music by Name:', musicByName);

	// Lê a música pelo ID (substitua o número do ID apropriado)
	const musicIdToRead = 1; // Substitua pelo ID da música desejada
	const musicById = await MusicController.readMusicByID(musicIdToRead);
	console.log('Music by ID:', musicById);

	// Atualiza a música (substitui os dados do corpo apropriados)
	const updatedMusicBody: Music = {
		id: 0,// Usa o ID da música criada anteriormente
		name: 'Updated Song',
		genre: 'Rock', // Atualiza o gênero conforme necessário
		album: 'Updated Album', // Atualiza o álbum conforme necessário
		artistId: 0 // Atualiza o ID do artista conforme necessário
	};
	const updatedMusic = await MusicController.updateMusic(updatedMusicBody);
	console.log('Updated Music:', updatedMusic);

	// Deleta a música pelo ID (substitui o número do ID apropriado)
	const musicIdToDelete = 0; // Usa o ID da música criada anteriormente
	const deletedMusic = await MusicController.deleteMusic(musicIdToDelete);
	console.log('Deleted Music:', deletedMusic);
	
}

main()
	.then(() => console.log('Done'))
	.catch((error) => console.error(error))
	.finally(async () => {
		await Prisma.$disconnect();
	});
