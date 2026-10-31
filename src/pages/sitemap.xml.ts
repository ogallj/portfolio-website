import type { APIRoute } from 'astro';
import { projects } from '../data/portfolio';
export const GET: APIRoute = () => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/software/', '/creative-marketing/', '/about/', '/cv/', '/contact/', ...projects.map(project => `/software/${project.slug}/`)].map(path => `<url><loc>https://ogallo.netlify.app${path}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
