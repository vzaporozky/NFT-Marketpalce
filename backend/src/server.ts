import Fastify from 'fastify';
import fastifySecureSession from '@fastify/secure-session';

import fs from 'fs';
import path from 'path';
import prismaPlugin from './plugins/prisma';
import shutdownPlugin from './plugins/shutdown';
import photoRoutes from './modules/photo/routes/photoRoutes';

export const fastify = Fastify({
	logger: true,
});

fastify.register(prismaPlugin);
fastify.register(shutdownPlugin);
fastify.register(fastifySecureSession, {
	sessionName: 'session',
	cookieName: 'my-session-cookie',
	key: fs.readFileSync(path.join(__dirname, 'secret-key')),
	expiry: 24 * 60 * 60,
});
fastify.register(photoRoutes);

const startServer = async () => {
	try {
		fs.mkdirSync(path.join(__dirname, 'photos'), { recursive: true });

		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		fastify.log.info('Server listening on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

export default startServer;
