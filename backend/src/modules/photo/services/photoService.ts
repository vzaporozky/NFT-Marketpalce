import { checkUserBalance } from '../../../utils/checkBalance';
import { createPhotoOnServer } from './createPhoto';
import { fastify } from '../../../server';

export async function createPhotoService({ title, description, userAddress }) {
	try {
		if (!title || !userAddress) {
			throw new Error('Title and userAddress are required');
		}

		const hasEnoughBalance = await checkUserBalance(fastify, userAddress);
		if (!hasEnoughBalance) {
			throw new Error('Insufficient balance to create photo');
		}

		const { photoPath, photoId } = await createPhotoOnServer(
			fastify,
			description
		);

		const user = await fastify.prisma.user.findUnique({
			where: { id: userAddress },
		});

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
