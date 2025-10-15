import { fastify } from '../../../server';

export const getPhotos = async (request, reply) => {
	try {
		const userAddress = request.body;

		if (!userAddress || typeof userAddress !== 'string') {
			return reply.status(400).send({ error: 'Invalid or missing address' });
		}

		const user = await fastify.prisma.user.findUnique({
			where: {
				userAddress: userAddress,
			},
		});

		if (!user) {
			await fastify.prisma.user.create({
				data: {
					userAddress: userAddress,
				},
			});

			return reply.status(200).send([]);
		}

		const userPhotos = await fastify.prisma.user.findUnique({
			where: {
				userAddress: userAddress,
			},
			include: {
				photos: true,
			},
		});

		return reply.status(200).send(userPhotos.photos);
	} catch (error) {
		return reply
			.status(500)
			.send({ error: `Failed to retrieve photos: ${error.message}` });
	}
};
