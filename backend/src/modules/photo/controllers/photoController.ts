import { createPhotoService } from '../services/photoService';

export const createPhoto = async (request, reply) => {
	try {
		const { title, description, userAddress } = request.body;

		const { photo, photoPath } = await createPhotoService(
			title,
			description,
			userAddress
		);

		// return reply.code(201).send({ photo });
		reply.header('Content-Type', 'image/jpeg');

		return reply.sendFile(photoPath);
	} catch (error) {
		return reply.code(400).send({ error: error.message });
	}
};
