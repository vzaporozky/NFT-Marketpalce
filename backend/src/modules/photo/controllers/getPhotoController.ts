import path from 'path';
import { fastify } from '../../../server';
import * as fs from 'fs';

export const getPhoto = async (request, reply) => {
	try {
		const { photoPath } = request.body;

		if (!photoPath || typeof photoPath !== 'string') {
			return reply.status(400).send({ error: 'Invalid or missing path' });
		}

		// let fileExists = fs.existsSync(photoPath);

		// if (!fileExists) {
		// 	return reply.status(404).send('File does not exist');
		// }

		const fileName = path.basename(photoPath);

		console.log(fileName);
		console.log(fileName);

		reply.header('Content-Type', 'image/jpeg');
		return reply.sendFile(fileName);
	} catch (error) {
		return reply
			.status(500)
			.send({ error: `Failed to retrieve photos: ${error.message}` });
	}
};
