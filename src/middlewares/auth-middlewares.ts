import { Request, Response, NextFunction } from 'express';
import { statusCodes } from '../../utils/constants/statusCodes';
import { PermissionError } from '../../errors/PermissionError';
import { User } from '@prisma/client';
import UserService from '../domains/User/services/UserService';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

function generateJWT(user: User, res: Response) {
	const body = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const token = jwt.sign({ user: body }, process.env.SECRET_KEY as string,
		{ expiresIn: process.env.JWT_EXPIRATION });

	res.cookie('jwt', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
	});
}

function cookieExtractor(req: Request) {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['jwt'];
	}
	return token;
}

async function loginMiddleware(req: Request, res: Response, next: NextFunction) {
	try {
		const user = await UserService.readByEmail(req.user.email);
		if (!user) {
			throw new PermissionError('Email e/ou senha incorretos.');
		} else {
			const matchingPassword = await bcrypt.compare(req.user.password, user.password);
			if (!matchingPassword) {
				throw new PermissionError('Email e/ou senha incorretos.');
			}
		}

		generateJWT(user, res);

		res.status(statusCodes.NO_CONTENT).end();
	} catch (error) {
		next(error);
	}
}

// async function notLoggedIn(req: Request, res: Response, next: NextFunction){}

function verifyJWT(req: Request, res: Response, next: NextFunction) {
	try {
		const token = cookieExtractor(req);
		if (token) {
			const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;
			req.user = decoded.user;
		}
		if (!req.user) {
			throw new PermissionError('Você precisa estar logado para realizar esta ação.');
		}
		next();
	} catch (error) {
		next(error);
	}
}


export default { loginMiddleware, verifyJWT }; // adicionar notLoggedIn