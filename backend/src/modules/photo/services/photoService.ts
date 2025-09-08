// import { checkUserBalance } from '../../../utils/checkBalance';
import { createPhotoOpenAI } from './createPhotoOpenAI';
import { fastify } from '../../../server';

async function createPhotoService(title, description, userAddress) {
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

		// const hasEnoughBalance = await checkUserBalance(userAddress);
		// if (!hasEnoughBalance) {
		// 	throw new Error('Insufficient balance to create photo');
		// }

		const { photoPath, photoId, defaultPrompt } = await createPhotoOpenAI(
			fastify,
			description
		);

		if (!description) description = defaultPrompt;

		await fastify.prisma.photo.create({
			data: {
				user: {
					connect: { userAddress: userAddress },
				},
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
