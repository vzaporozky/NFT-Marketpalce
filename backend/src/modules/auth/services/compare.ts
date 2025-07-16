import { fastify } from '../../../server';
import bcrypt from 'bcrypt';

async function comparePassword(
	userAddress: string,
	plainPassword: string
): Promise<boolean> {
	const user = await fastify.prisma.user.findUnique({
		where: { userAddress },
		select: { password: true },
	});

	if (!user) {
		return false;
	}

	return await bcrypt.compare(plainPassword, user.password);
}

export { comparePassword };
