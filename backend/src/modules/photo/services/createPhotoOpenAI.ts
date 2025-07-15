import path from 'path';
import OpenAI from 'openai';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';

const TEMP_DIR = '/app/temp';

export async function createPhotoOpenAI(fastify, description) {
	try {
		const openai = new OpenAI();

		const photoId = nanoid();
		const photoPath = path.join(TEMP_DIR, `${photoId}.jpg`);

		const response = await openai.responses.create({
			model: 'gpt-4.1-mini',
			input:
				'Generate an image of cyberpunk girl with pink hair and light blue eyes',
			tools: [{ type: 'image_generation' }],
		});

		const imageData = response.output
			.filter(output => output.type === 'image_generation_call')
			.map(output => output.result);

		if (imageData.length > 0) {
			const imageBase64 = imageData[0];

			fs.writeFile(photoPath, Buffer.from(imageBase64, 'base64'));
		}

		return { photoPath, photoId };
	} catch (error) {
		fastify.log.error('Photo creation error:', error);
		throw new Error('Failed to create photo');
	}
}
