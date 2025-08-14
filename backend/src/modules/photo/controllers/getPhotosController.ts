import { fastify } from '../../../server';

export const getPhoto = async (request, reply) => {
	try {
		const { address } = request.body;

		const user = await fastify.prisma.user.findUnique({
			where: {
				userAddress: address,
			},
		});

		console.log(user);

		if (!address || typeof address !== 'string') {
			return reply.status(400).send({ error: 'Invalid or missing address' });
		}

		const photos = await fastify.prisma.photo.findMany({
			where: {
				userAddress: address,
			},
			select: {
				photoPath: true,
			},
		});

		return reply.status(200).send(photos);
	} catch (error) {
		return reply
			.status(500)
			.send({ error: `Failed to retrieve photos: ${error.message}` });
	}
};
