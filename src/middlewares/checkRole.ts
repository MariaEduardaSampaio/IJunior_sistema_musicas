// Analisar req.role e req.user.role
// Chamar next() ou retornar erro de permissao
import { NextFunction, Request, Response } from 'express';
import statusCodes from '../../utils/constants/statusCodes';
import UserRoles from '../../utils/constants/userRoles';

function checkRoles(req: Request, res: Response, next: NextFunction) {
	const role = req.body.role;

	if (role === UserRoles.ADMIN) {
		next(); // OK - pode continuar
	} else {
		res.status(statusCodes.FORBIDDEN).json('Você não tem permissão para acessar essa rota.');
	}
}


export default checkRoles;