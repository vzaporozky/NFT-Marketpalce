import { fastify } from '../../../server';
import bcrypt from 'bcrypt';

async function createUser(request, reply) {
	try {
		let { userAddress, password } = request.body;

		if (!userAddress || !password) {
			return reply.status(400).send({
				error: 'Missing required fields',
				message: 'userAddress and password are required',
			});
		}

		const user = await fastify.prisma.user.findUnique({
			where: { userAddress: userAddress },
		});

		if (user) {
			return reply.send({
				error: 'User already exist',
				message: 'User already exist. Try log in',
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const userNew = await fastify.prisma.user.create({
			data: {
				userAddress,
				password: hashedPassword,
			},
		});

		reply.status(201).send({
			message: 'User created successfully',
			user: {
				id: userNew.id,
				userAddress: userNew.userAddress,
				createdAt: userNew.createdAt,
			},
		});
	} catch (error) {
		if (error.code === 'P2002') {
			return reply.status(409).send({
				error: 'Conflict',
				message: `User with userAddress '${request.body.userAddress}' already exists`,
			});
		}

		console.error('Error creating user:', error);

		reply.status(500).send({
			error: 'Internal Server Error',
			message: 'Failed to create user',
		});
	}
}

export { createUser };
