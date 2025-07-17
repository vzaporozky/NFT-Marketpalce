import path from 'path';
import OpenAI from 'openai';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';

const TEMP_DIR = '/app/temp';

async function createPhotoOpenAI(fastify, description) {
	try {
		await fs.mkdir(TEMP_DIR, { recursive: true });

		const openai = new OpenAI({
			apiKey: process.env.OPEN_AI_KEY,
		});

		const photoId = nanoid();
		const photoPath = path.join(TEMP_DIR, `${photoId}.png`);

		const defaultPrompt =
			'A cyberpunk robot with pink hair and light blue eyes';

		const response = await openai.images.generate({
			model: 'dall-e-2',
			prompt: description || defaultPrompt,
			n: 1,
			size: '1024x1024',
			response_format: 'b64_json',
		});

		const imageData = response.data[0].b64_json;

		if (!imageData) {
			throw new Error('No image data returned from OpenAI API');
		}

		const image_bytes = Buffer.from(imageData, 'base64');
		await fs.writeFile(photoPath, image_bytes);

		return { photoPath, photoId, defaultPrompt };
	} catch (error) {
		fastify.log.error('Photo creation error:', error);
		throw new Error('Failed to create photo');
	}
}

export { createPhotoOpenAI };
