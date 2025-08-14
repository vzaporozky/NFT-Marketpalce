import { createPhoto } from '../controllers/createPhotoController';
import { getPhoto } from '../controllers/getPhotosController';

export default async function (fastify) {
	fastify.post('/createPhoto', createPhoto);
	fastify.post('/getPhotos', getPhoto);
}
