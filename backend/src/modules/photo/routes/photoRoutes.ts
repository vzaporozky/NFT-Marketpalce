import { createPhoto } from '../controllers/createPhotoController';
import { getPhotos } from '../controllers/getPhotosController';
import { getPhoto } from '../controllers/getPhotoController';

export default async function (fastify) {
	fastify.post('/createPhoto', createPhoto);
	fastify.post('/getPhotos', getPhotos);
	fastify.post('/getPhoto', getPhoto);
}
