import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const properties = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/properties' }),
  schema: z.object({
    name: z.string().max(100),
    region: z.string(),
    stayType: z.string().min(1).max(50),
    priceRange: z.object({
      min: z.number().int().min(1).max(9999),
      max: z.number().int().min(1).max(9999),
    }),
    driveTimes: z.record(z.string(), z.number().int()),
    privacyLevel: z.number().int().min(3).max(5),
    amenities: z.array(z.string()).min(1),
    wowFactor: z.string().min(20).max(300),
    bookingUrl: z.string().url(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    nearbyHikes: z.array(z.object({
      name: z.string().max(100),
      distance: z.string().max(30).optional(),
    })).min(1).max(20),
    seasonalTags: z.array(z.string()).max(10).optional(),
    lastVerified: z.coerce.date().optional(),
    roadAccess: z.enum(['sedan-friendly']),
  }).refine(
    (data) => data.amenities.some(a =>
      a.toLowerCase().includes('hot tub') || a.toLowerCase().includes('soaking tub')
    ),
    { message: 'Curation standard: property must have hot tub or soaking tub' }
  ),
});

const regions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(),
    description: z.string().min(50),
    highlights: z.array(z.string()).min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

const originCities = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/origin-cities' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
});

const seasonalGuides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/seasonal-guides' }),
  schema: z.object({
    title: z.string(),
    season: z.enum(['spring', 'summer', 'fall', 'winter']),
    featuredProperties: z.array(z.string()).min(3).max(10),
    description: z.string().min(50).max(300),
  }),
});

export const collections = { properties, regions, originCities, seasonalGuides };
