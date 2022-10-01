import { Hono } from 'hono';

const app = new Hono();

app.use('*', async (c, next) => {
	await next()
	c.header('x-powered-by', 'uneknown')
});

app.get('/:name', async (c) => {
	const name = c.req.param('name');
	const size = parseSize(c.req.query('size'));

	const hash = await hashString(name);

	return c.json({ hash, size }, 200);
});

const hashString = async (data: string) => {
	const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const parseSize = (size: string) => {
	const maxSize = 1000
	if (size && size.match(/^-?\d+$/) && parseInt(size) <= maxSize) {
		return parseInt(size, 10)
	}
	// Default size
	return 120
};

export default app