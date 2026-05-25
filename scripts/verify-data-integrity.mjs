/**
 * Data Integrity Verification Script
 * Task 7.2: Verify data integrity across all content files
 * 
 * Checks:
 * 1. Total property count matches .md files in src/content/properties/
 * 2. Total region count matches .md files in src/content/regions/
 * 3. All property region fields reference existing region file slugs
 * 4. All property filenames match their slug frontmatter field
 * 5. All slugs are unique across the collection
 * 6. All region filenames match their slug frontmatter field
 * 7. Every region is referenced by at least one property
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

const PROPERTIES_DIR = 'src/content/properties';
const REGIONS_DIR = 'src/content/regions';

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  let currentKey = null;
  let inArray = false;
  let arrayItems = [];
  
  for (const line of lines) {
    // Handle array items
    if (inArray) {
      if (line.match(/^\s+-/)) {
        arrayItems.push(line.replace(/^\s+-\s*/, '').trim());
        continue;
      } else {
        frontmatter[currentKey] = arrayItems;
        inArray = false;
        arrayItems = [];
      }
    }
    
    // Handle key-value pairs
    const kvMatch = line.match(/^(\w+):\s*(.*)/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value === '' || value === undefined) {
        // Could be start of array or nested object
        currentKey = key;
        inArray = true;
        arrayItems = [];
      } else {
        // Strip quotes
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  }
  
  // Handle trailing array
  if (inArray && arrayItems.length > 0) {
    frontmatter[currentKey] = arrayItems;
  }
  
  return frontmatter;
}

async function getMarkdownFiles(dir) {
  const files = await readdir(dir);
  return files.filter(f => f.endsWith('.md'));
}

async function main() {
  const errors = [];
  const warnings = [];
  let passed = 0;
  
  console.log('=== Data Integrity Verification ===\n');
  
  // 1. Count property files
  const propertyFiles = await getMarkdownFiles(PROPERTIES_DIR);
  console.log(`Property files found: ${propertyFiles.length}`);
  
  // 2. Count region files
  const regionFiles = await getMarkdownFiles(REGIONS_DIR);
  console.log(`Region files found: ${regionFiles.length}`);
  
  // Get region slugs (filename stems)
  const regionSlugs = new Set(regionFiles.map(f => basename(f, '.md')));
  console.log(`Region slugs: ${[...regionSlugs].join(', ')}`);
  console.log('');
  
  // Parse all property frontmatter
  const properties = [];
  for (const file of propertyFiles) {
    const content = await readFile(join(PROPERTIES_DIR, file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      errors.push(`[ERROR] Could not parse frontmatter in ${file}`);
      continue;
    }
    properties.push({ file, slug: fm.slug, region: fm.region, frontmatter: fm });
  }
  
  // Parse all region frontmatter
  const regions = [];
  for (const file of regionFiles) {
    const content = await readFile(join(REGIONS_DIR, file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      errors.push(`[ERROR] Could not parse frontmatter in regions/${file}`);
      continue;
    }
    regions.push({ file, slug: fm.slug, frontmatter: fm });
  }
  
  // 3. Verify property filenames match slug frontmatter field
  console.log('--- Check: Property filename matches slug field ---');
  for (const prop of properties) {
    const filenameStem = basename(prop.file, '.md');
    if (filenameStem !== prop.slug) {
      errors.push(`[ERROR] Filename mismatch: ${prop.file} has slug="${prop.slug}" (expected "${filenameStem}")`);
    } else {
      passed++;
    }
  }
  console.log(`  ${passed} properties have matching filename/slug`);
  const filenameMismatches = errors.filter(e => e.includes('Filename mismatch'));
  if (filenameMismatches.length > 0) {
    filenameMismatches.forEach(e => console.log(`  ${e}`));
  } else {
    console.log('  ✓ All property filenames match their slug field');
  }
  console.log('');
  
  // 4. Verify all property region fields reference existing region slugs
  console.log('--- Check: Property region references valid region slug ---');
  let regionRefPassed = 0;
  for (const prop of properties) {
    if (!regionSlugs.has(prop.region)) {
      errors.push(`[ERROR] Invalid region reference: ${prop.file} has region="${prop.region}" which does not exist`);
    } else {
      regionRefPassed++;
    }
  }
  console.log(`  ${regionRefPassed}/${properties.length} properties reference valid regions`);
  const invalidRegionRefs = errors.filter(e => e.includes('Invalid region reference'));
  if (invalidRegionRefs.length > 0) {
    invalidRegionRefs.forEach(e => console.log(`  ${e}`));
  } else {
    console.log('  ✓ All property region fields reference existing region files');
  }
  console.log('');
  
  // 5. Verify all property slugs are unique
  console.log('--- Check: Property slug uniqueness ---');
  const slugCounts = {};
  for (const prop of properties) {
    slugCounts[prop.slug] = (slugCounts[prop.slug] || 0) + 1;
  }
  const duplicateSlugs = Object.entries(slugCounts).filter(([, count]) => count > 1);
  if (duplicateSlugs.length > 0) {
    for (const [slug, count] of duplicateSlugs) {
      errors.push(`[ERROR] Duplicate property slug: "${slug}" appears ${count} times`);
    }
    duplicateSlugs.forEach(([slug, count]) => console.log(`  [ERROR] "${slug}" appears ${count} times`));
  } else {
    console.log(`  ✓ All ${properties.length} property slugs are unique`);
  }
  console.log('');
  
  // 6. Verify region filenames match slug frontmatter field
  console.log('--- Check: Region filename matches slug field ---');
  let regionSlugPassed = 0;
  for (const region of regions) {
    const filenameStem = basename(region.file, '.md');
    if (filenameStem !== region.slug) {
      errors.push(`[ERROR] Region filename mismatch: ${region.file} has slug="${region.slug}" (expected "${filenameStem}")`);
    } else {
      regionSlugPassed++;
    }
  }
  console.log(`  ${regionSlugPassed}/${regions.length} regions have matching filename/slug`);
  const regionMismatches = errors.filter(e => e.includes('Region filename mismatch'));
  if (regionMismatches.length > 0) {
    regionMismatches.forEach(e => console.log(`  ${e}`));
  } else {
    console.log('  ✓ All region filenames match their slug field');
  }
  console.log('');
  
  // 7. Verify every region is referenced by at least one property
  console.log('--- Check: Every region has at least one property ---');
  const referencedRegions = new Set(properties.map(p => p.region));
  let unreferencedRegions = [];
  for (const slug of regionSlugs) {
    if (!referencedRegions.has(slug)) {
      unreferencedRegions.push(slug);
      warnings.push(`[WARNING] Region "${slug}" has no properties referencing it`);
    }
  }
  if (unreferencedRegions.length > 0) {
    unreferencedRegions.forEach(r => console.log(`  [WARNING] Region "${r}" has no properties`));
  } else {
    console.log(`  ✓ All ${regionSlugs.size} regions have at least one property`);
  }
  console.log('');
  
  // 8. Verify region slug uniqueness
  console.log('--- Check: Region slug uniqueness ---');
  const regionSlugCounts = {};
  for (const region of regions) {
    regionSlugCounts[region.slug] = (regionSlugCounts[region.slug] || 0) + 1;
  }
  const duplicateRegionSlugs = Object.entries(regionSlugCounts).filter(([, count]) => count > 1);
  if (duplicateRegionSlugs.length > 0) {
    for (const [slug, count] of duplicateRegionSlugs) {
      errors.push(`[ERROR] Duplicate region slug: "${slug}" appears ${count} times`);
    }
  } else {
    console.log(`  ✓ All ${regions.length} region slugs are unique`);
  }
  console.log('');
  
  // Summary
  console.log('=== Summary ===');
  console.log(`Total properties: ${propertyFiles.length}`);
  console.log(`Total regions: ${regionFiles.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log('');
  
  if (errors.length > 0) {
    console.log('ERRORS:');
    errors.forEach(e => console.log(`  ${e}`));
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('All integrity checks passed with warnings.');
    process.exit(0);
  } else {
    console.log('✓ All integrity checks passed!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
