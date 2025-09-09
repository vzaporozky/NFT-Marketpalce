import { createPhotoOpenAI } from './createPhotoOpenAI';
import { fastify } from '../../../server';

async function createPhotoService(
	createPhotoId,
	title,
	description,
	userAddress,
	transactionHash
) {
	try {
		if (!title || !userAddress) {
			throw new Error('Title and userAddress are required');
		}

		const user = await fastify.prisma.user.findUnique({
			where: { userAddress: userAddress },
		});

		if (!user) {
			throw new Error('User not found');
		}

		const { photoPath, photoId, defaultPrompt } = await createPhotoOpenAI(
			fastify,
			description
		);

		if (!description) description = defaultPrompt;

		await fastify.prisma.photo.update({
			where: {
				id: createPhotoId,
			},
			data: {
				photoPath,
				description,
			},
		});

		return { photoId, photoPath };
	} catch (error) {
		fastify.log.error(error);
		throw new Error(error.message || 'Internal Server Error');
	}
}

export { createPhotoService };
