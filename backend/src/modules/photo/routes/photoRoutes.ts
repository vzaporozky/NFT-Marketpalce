import { createPhoto } from '../controllers/photoController';

export default async function (fastify) {
	fastify.post('/createPhoto', createPhoto);
}
