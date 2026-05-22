export interface LightRailStation {
  name: string;
  lat: number;
  lng: number;
  line: 'blue' | 'gold';
}

export const lightRailStations: LightRailStation[] = [
  // LYNX Blue Line (south to north) — coordinates from Google Maps
  { name: "I-485/South Boulevard", lat: 35.10741, lng: -80.88232, line: "blue" },
  { name: "Sharon Road West", lat: 35.11940, lng: -80.88201, line: "blue" },
  { name: "Arrowood", lat: 35.13596, lng: -80.87646, line: "blue" },
  { name: "Archdale", lat: 35.15343, lng: -80.87764, line: "blue" },
  { name: "Tyvola", lat: 35.16330, lng: -80.87776, line: "blue" },
  { name: "Woodlawn", lat: 35.17629, lng: -80.87912, line: "blue" },
  { name: "Scaleybark", lat: 35.19095, lng: -80.87503, line: "blue" },
  { name: "New Bern", lat: 35.20063, lng: -80.86943, line: "blue" },
  { name: "East/West Boulevard", lat: 35.21348, lng: -80.85918, line: "blue" },
  { name: "Bland Street", lat: 35.21690, lng: -80.85557, line: "blue" },
  { name: "Carson", lat: 35.21996, lng: -80.85093, line: "blue" },
  { name: "Brooklyn Village", lat: 35.22217, lng: -80.84713, line: "blue" },
  { name: "3rd Street/Convention Center", lat: 35.22391, lng: -80.84337, line: "blue" },
  { name: "CTC/Arena", lat: 35.22585, lng: -80.84080, line: "blue" },
  { name: "7th Street", lat: 35.22770, lng: -80.83774, line: "blue" },
  { name: "9th Street", lat: 35.22984, lng: -80.83502, line: "blue" },
  { name: "Parkwood", lat: 35.23718, lng: -80.82341, line: "blue" },
  { name: "25th Street", lat: 35.24183, lng: -80.81697, line: "blue" },
  { name: "36th Street", lat: 35.24936, lng: -80.80608, line: "blue" },
  { name: "Sugar Creek", lat: 35.25175, lng: -80.79287, line: "blue" },
  { name: "Old Concord Road", lat: 35.26009, lng: -80.77269, line: "blue" },
  { name: "Tom Hunter", lat: 35.27812, lng: -80.76409, line: "blue" },
  { name: "University City Blvd", lat: 35.28718, lng: -80.76027, line: "blue" },
  { name: "McCullough", lat: 35.30132, lng: -80.75176, line: "blue" },
  { name: "JW Clay Blvd", lat: 35.31083, lng: -80.74520, line: "blue" },
  { name: "UNC Charlotte Main", lat: 35.31250, lng: -80.73376, line: "blue" },

  // CityLYNX Gold Line (west to east) — coordinates from Google Maps
  { name: "French Street", lat: 35.2340, lng: -80.8640, line: "gold" },
  { name: "Johnson C. Smith", lat: 35.2330, lng: -80.8580, line: "gold" },
  { name: "Wesley Heights", lat: 35.2300, lng: -80.8500, line: "gold" },
  { name: "Irwin Avenue", lat: 35.2280, lng: -80.8460, line: "gold" },
  { name: "CTC/Trade Street", lat: 35.2270, lng: -80.8410, line: "gold" },
  { name: "Novant Health", lat: 35.2240, lng: -80.8320, line: "gold" },
  { name: "Hawthorne Lane", lat: 35.2220, lng: -80.8250, line: "gold" },
  { name: "Briar Creek Road", lat: 35.2200, lng: -80.8180, line: "gold" },
  { name: "Sunnyside", lat: 35.2170, lng: -80.8100, line: "gold" },
];
