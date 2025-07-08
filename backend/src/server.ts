import Fastify from 'fastify';

import fs from 'fs';
import path from 'path';
import { createPhoto } from './utils/createPhoto';
import prismaPlugin from './plugins/prisma';
import shutdownPlugin from './plugins/shutdown';

const fastify = Fastify({
	logger: true,
});

fastify.register(prismaPlugin);
fastify.register(shutdownPlugin);

fastify.post('/createPhoto', createPhoto);

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
