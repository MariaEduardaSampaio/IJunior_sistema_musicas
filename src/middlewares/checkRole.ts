import { NextFunction, Request, Response } from 'express';
import statusCodes from '../../utils/constants/statusCodes';

function checkRoles(roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const role = req.user!.role; // Verifica o cargo do usuario logado no sistema => req.user

		if (roles.includes(role)) { // O usuario tem algum cargo da lista de cargos permitidos
			next(); // OK - pode continuar
		} else {
			res.status(statusCodes.FORBIDDEN).json('Você não tem permissão para acessar essa rota.');
		}
	};
}


export default checkRoles;
