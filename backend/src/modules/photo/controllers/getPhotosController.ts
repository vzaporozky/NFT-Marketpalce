import { fastify } from '../../../server';

export const getPhotos = async (request, reply) => {
	try {
		const address = request.body;

		if (!address || typeof address !== 'string') {
			return reply.status(400).send({ error: 'Invalid or missing address' });
		}

		const user = await fastify.prisma.user.findUnique({
			where: {
				userAddress: address,
			},
		});

		if (!user) {
			await fastify.prisma.user.create({
				data: {
					userAddress: address,
				},
			});

			return reply.status(200).send([]);
		}

		const userPhotos = await fastify.prisma.user.findUnique({
			where: {
				userAddress: address,
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
