import os from 'node:os';
import path from 'node:path';

// provide required settings before modules validate the environment, so tests don't depend on a developer's local .env file.
process.env.BOT_TOKEN = '123:test';
process.env.SVG_RENDERER_URL = 'http://localhost';
process.env.STRIPE_TOKEN = 'stripe-test-token';
process.env.LOCAL_API_ROOT = 'false';
process.env.IMAGES_PATH = path.join(os.tmpdir(), 'themerbot-test');
