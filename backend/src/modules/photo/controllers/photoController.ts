import { balanceManagerEther } from '../../../utils/balanceMaganer';
import { createPhotoService } from '../services/photoService';

export const createPhoto = async (request, reply) => {
	try {
		const { title, description, userAddress } = request.body;

		// const { photoId, photoPath } = await createPhotoService(
		// 	title,
		// 	description,
		// 	userAddress
		// );

		// testEther();
		balanceManagerEther();

		reply.header('Content-Type', 'image/jpeg');
		// return reply.sendFile(photoId + '.png');
	} catch (error) {
		return reply.code(500).send({ error: 'Failed to create or send photo' });
	}
};
