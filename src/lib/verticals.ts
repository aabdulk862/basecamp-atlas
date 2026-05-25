import type { VerticalConfig } from './types';

/**
 * Loads all vertical configuration files from src/verticals/*.json at build time.
 * Uses import.meta.glob for Astro/Vite compatibility.
 */
export function loadVerticals(): VerticalConfig[] {
  const modules = import.meta.glob<VerticalConfig>('/src/verticals/*.json', {
    eager: true,
    import: 'default',
  });

  const configs = Object.values(modules);
  validateVerticals(configs);
  return configs.sort((a, b) => a.order - b.order);
}

/**
 * Returns the active vertical whose routePrefix is a prefix of the given pathname.
 * Uses longest prefix match — if pathname is "/escape/asheville", it matches "/escape" not "/".
 * Returns null if no vertical matches.
 */
export function getActiveVertical(
  pathname: string,
  verticals?: VerticalConfig[]
): VerticalConfig | null {
  const configs = verticals ?? loadVerticals();

  let bestMatch: VerticalConfig | null = null;
  let longestPrefix = 0;

  for (const config of configs) {
    const prefix = config.routePrefix;

    // The pathname must start with the prefix, and either:
    // - the pathname equals the prefix exactly, or
    // - the next character after the prefix is a "/"
    const isMatch =
      pathname === prefix ||
      (pathname.startsWith(prefix) &&
        (prefix === '/' || pathname[prefix.length] === '/' || pathname.length === prefix.length));

    if (isMatch && prefix.length > longestPrefix) {
      bestMatch = config;
      longestPrefix = prefix.length;
    }
  }

  return bestMatch;
}

/**
 * Validates an array of vertical configs. Throws an error if:
 * - Any config is missing required fields (id, name, routePrefix, palette, order)
 * - Any name exceeds 20 characters
 * - Any routePrefix does not start with "/"
 * - Two configs share the same routePrefix
 */
export function validateVerticals(configs: VerticalConfig[]): void {
  const requiredFields: (keyof VerticalConfig)[] = [
    'id',
    'name',
    'routePrefix',
    'palette',
    'order',
  ];

  for (const config of configs) {
    for (const field of requiredFields) {
      const value = config[field];
      if (value === undefined || value === null || value === '') {
        throw new Error(
          `Vertical "${config.id || '(unknown)'}" is missing required field: ${field}`
        );
      }
    }

    if (config.name.length > 20) {
      throw new Error(
        `Vertical "${config.id}" name exceeds 20 characters: "${config.name}" (${config.name.length} chars)`
      );
    }

    if (!config.routePrefix.startsWith('/')) {
      throw new Error(
        `Vertical "${config.id}" routePrefix must start with "/": "${config.routePrefix}"`
      );
    }
  }

  // Check for duplicate route prefixes
  const seen = new Map<string, string>();
  for (const config of configs) {
    const existing = seen.get(config.routePrefix);
    if (existing) {
      throw new Error(
        `Duplicate routePrefix "${config.routePrefix}" found in verticals "${existing}" and "${config.id}"`
      );
    }
    seen.set(config.routePrefix, config.id);
  }
}
