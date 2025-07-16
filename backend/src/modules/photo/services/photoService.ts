import { checkUserBalance } from '../../../utils/checkBalance';
import { createPhotoOpenAI } from './createPhotoOpenAI';
import { fastify } from '../../../server';

async function createPhotoService({ title, description, userAddress }) {
	try {
		if (!title || !userAddress) {
			throw new Error('Title and userAddress are required');
		}

		const user = await fastify.prisma.user.findUnique({
			where: { id: userAddress },
		});

		if (!user) {
			throw new Error('User not found');
		}

		// const hasEnoughBalance = await checkUserBalance(userAddress);
		// if (!hasEnoughBalance) {
		// 	throw new Error('Insufficient balance to create photo');
		// }

		const { photoPath, photoId } = await createPhotoOpenAI(
			fastify,
			description
		);

		const photo = await fastify.prisma.photo.create({
			data: {
				user: {
					connect: { id: userAddress },
				},
				photoPath,
				description,
			},
		});

		return { photo };
	} catch (error) {
		fastify.log.error(error);
		throw new Error(error.message || 'Internal Server Error');
	}
}

export { createPhotoService };
