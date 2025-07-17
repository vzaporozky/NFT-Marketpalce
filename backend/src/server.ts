import Fastify from 'fastify';

import fs from 'fs';
import path from 'path';
import prismaPlugin from './plugins/prisma';
import shutdownPlugin from './plugins/shutdown';
import photoRoutes from './modules/photo/routes/photoRoutes';
import { authRoutes } from './modules/auth/routes/auth.routes';
const jwtPlugin = require('./plugins/jwtPlugin');

export const fastify = Fastify({
	logger: true,
});

const TEMP_DIR = '/app/temp';

require('dotenv').config();

fastify.register(jwtPlugin);
fastify.register(prismaPlugin);
fastify.register(shutdownPlugin);
fastify.register(require('@fastify/static'), {
	root: TEMP_DIR,
	// prefix: '/uploads/',
});

fastify.register(authRoutes, { prefix: '/auth' });
fastify.register(photoRoutes, { prefix: '/photo' });

const startServer = async () => {
	try {
		fs.mkdirSync(path.join(__dirname, 'photos'), { recursive: true });

		await fastify.listen({ port: 3000, host: '0.0.0.0' });
		fastify.log.info('Server listening on http://localhost:3000');
	} catch (err) {
		fastify.log.error(err);
		await fastify.prisma.$disconnect();
		process.exit(1);
	}
};

export default startServer;
