import { createPhoto } from '../controllers/createPhotoController';
import { getPhotos } from '../controllers/getPhotosController';
import { getPhoto } from '../controllers/getPhotoController';

export default async function (fastify) {
	fastify.use(async (request, reply, next) => {
		const { userAddress } = request.body;

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
		next();
	});

	fastify.post('/createPhoto', createPhoto);
	fastify.post('/getPhotos', getPhotos);
	fastify.post('/getPhoto', getPhoto);
}
