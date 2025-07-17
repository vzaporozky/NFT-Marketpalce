import { createUser } from '../controllers/auth.controller';
import bcrypt from 'bcrypt';

async function authRoutes(fastify) {
	fastify.post('/', createUser);
	fastify.post('/login', async (request, reply) => {
		const { userAddress, password } = request.body;

		try {
			const user = await fastify.prisma.user.findUnique({
				where: { userAddress: userAddress },
			});

			if (!user) {
				return reply.status(401).send({ error: 'User not found.' });
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);

			if (!isPasswordValid) {
				return reply.status(401).send({ error: 'Incorrect data.' });
			}

			const token = fastify.jwt.sign({
				payload: {
					userAddress,
				},
			});

			reply.send({ token });
		} catch (error) {
			console.log(error);
			return reply
				.status(500)
				.send({ error: 'An error occurred during authorization.' });
		}
	});
}

export { authRoutes };
