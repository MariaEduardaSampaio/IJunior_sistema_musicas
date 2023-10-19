import { app } from './config/expressConfig';

app.listen(process.env.PORT, () => {
	console.log('Server is running in the port ' + process.env.PORT);
});