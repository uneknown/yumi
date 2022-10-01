import { Hono } from 'hono';
import { cache } from 'hono/cache'
import ColorHash from "color-hash";

const app = new Hono();

app.use('*', async (c, next) => {
	await next()
	c.header('x-powered-by', 'uneknown')
});

app.get('*', cache({ cacheName: 'yumi', cacheControl: 'max-age=3600' }))

app.get('/:name', async (c) => {
	const name = c.req.param('name');
	const size = parseSize(c.req.query('size'));

	const hash = await hashString(name);
	const image = generateSVG(hash, size);

	return c.html(image, 200);
});

export const generateColors = (s: string): [string, string] => {
	const colorHash = new ColorHash();
	const s1 = s.substring(0, s.length / 2);
	const s2 = s.substring(s.length / 2);
	const c1 = colorHash.hex(s1);
	const c2 = colorHash.hex(s)
  
	return [c1, c2];
  };

const generateSVG = (hash: string, size: number) => {
	const [c1, c2] = generateColors(hash);

	const svg = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="${size / 2}" cy="${size / 2}" r="${
	  size / 2
	}" fill="url(#gradient)" />
	<defs>
	  <linearGradient id="gradient" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
		<stop stop-color="${c1}" />
		<stop offset="1" stop-color="${c2}" />
	  </linearGradient>
	</defs>
  </svg>
	`.trim();

	return svg;
}

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

export default app;