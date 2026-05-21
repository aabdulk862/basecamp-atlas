"""
Fetch Google ratings for all apartments using the Places API.

Usage:
  GOOGLE_PLACES_API_KEY=your_key_here python3 scripts/fetch-google-ratings.py

This will:
1. Read all apartment names/addresses from src/data/apartments.ts
2. Search Google Places for each one
3. Print the ratings found
4. Update the apartments.ts file with googleRating field
"""

import os
import re
import json
import urllib.request
import urllib.parse
import time

API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
if not API_KEY:
    print("ERROR: Set GOOGLE_PLACES_API_KEY environment variable")
    print("  GOOGLE_PLACES_API_KEY=your_key python3 scripts/fetch-google-ratings.py")
    exit(1)

# Read apartments file
with open("src/data/apartments.ts", "r") as f:
    content = f.read()

# Extract apartment names and addresses
pattern = r'name: "([^"]+)".+?address: "([^"]+)"'
apartments = re.findall(pattern, content)

print(f"Found {len(apartments)} apartments. Fetching Google ratings...\n")
print(f"{'Name':<30} {'Rating':<8} {'Reviews':<10}")
print("-" * 50)

ratings = {}

for name, address in apartments[:3]:  # Test with just 3 first
    query = f"{name} {address} Charlotte NC"
    encoded = urllib.parse.quote(query)
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query={encoded}&key={API_KEY}"
    
    try:
        req = urllib.request.Request(url)
        resp = urllib.request.urlopen(req)
        data = json.loads(resp.read())
        
        # Debug: print full response status
        print(f"\n--- {name} ---")
        print(f"Query: {query}")
        print(f"Status: {data.get('status')}")
        if data.get("error_message"):
            print(f"Error: {data['error_message']}")
        
        if data.get("results") and len(data["results"]) > 0:
            result = data["results"][0]
            rating = result.get("rating")
            reviews = result.get("user_ratings_total", 0)
            ratings[name] = rating
            print(f"Found: {result.get('name')} | Rating: {rating} | Reviews: {reviews}")
        else:
            ratings[name] = None
            print(f"No results found")
    except Exception as e:
        ratings[name] = None
        print(f"ERROR: {e}")
    
    time.sleep(0.2)

# Skip the file update for now during debug
print("\n\nDebug mode - file not updated. Fix issues above first.")
exit(0)

# Now update the file - add googleRating to interface and entries
print(f"\n{'='*50}")
print(f"Updating apartments.ts...")

# Add googleRating to interface if not present
if "googleRating" not in content:
    content = content.replace(
        "  overallScore: number;\n  nearbyAttractions:",
        "  overallScore: number;\n  googleRating: number | null;\n  nearbyAttractions:"
    )

# Add googleRating to each entry
for name, rating in ratings.items():
    escaped_name = re.escape(name)
    rating_val = str(rating) if rating else "null"
    # Insert googleRating after overallScore
    pattern = rf'(name: "{escaped_name}".+?overallScore: [\d.]+)(, nearbyAttractions:)'
    replacement = rf'\1, googleRating: {rating_val}\2'
    content = re.sub(pattern, replacement, content)

with open("src/data/apartments.ts", "w") as f:
    f.write(content)

found = sum(1 for r in ratings.values() if r is not None)
print(f"Done! Updated {found}/{len(apartments)} apartments with Google ratings.")
print(f"\nRemember to update the UI components to display googleRating.")
