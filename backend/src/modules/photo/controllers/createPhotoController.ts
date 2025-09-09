import { fastify } from '../../../server';
import { checkTransaction } from '../../../utils/checkTr';
import { createPhotoService } from '../services/photoService';

export const createPhoto = async (request, reply) => {
	try {
		const { title, description, userAddress, transactionHash } = request.body;

		const createPhotoId = await checkTransaction(transactionHash, userAddress);

		if (!createPhotoId) {
			return reply.code(400).send({ error: 'Failed to check transaction' });
		}

		const { photoId, photoPath } = await createPhotoService(
			createPhotoId,
			title,
			description,
			userAddress
		);

		reply.header('Content-Type', 'image/jpeg');
		return reply.sendFile(photoId + '.png');
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to create or send photo' });
	}
};
