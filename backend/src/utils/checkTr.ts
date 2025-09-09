import { createPublicClient, http } from 'viem';
import { fastify } from '../server';
// import { mainnet } from 'viem/chains';
// import { fastify } from '../../../server';

const hardhatChain = {
	id: 31337,
	name: 'Hardhat',
	network: 'hardhat',
	nativeCurrency: {
		decimals: 18,
		name: 'Ether',
		symbol: 'ETH',
	},
	rpcUrls: {
		default: { http: ['http://host.docker.internal:8545'] },
		public: { http: ['http://host.docker.internal:8545'] },
	},
};

const checkTransaction = async (transactionHash, userAddress) => {
	const publicClient = createPublicClient({
		chain: hardhatChain,
		transport: http(),
	});

	const transaction = await publicClient.getTransaction({
		hash: transactionHash,
	});

	if (!transaction.input.includes('0x657f1a15')) {
		return null;
	}

	const receipt = await publicClient.getTransactionReceipt({
		hash: transactionHash,
	});

	if (receipt.status !== 'success') {
		return null;
	}

	const createdPhoto = await fastify.prisma.photo.create({
		data: {
			user: {
				connect: { userAddress: userAddress },
			},
			hash: transactionHash,
		},
		select: {
			id: true,
		},
	});

	return createdPhoto.id;
};

export { checkTransaction };
