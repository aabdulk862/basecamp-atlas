export interface LightRailStation {
  name: string;
  lat: number;
  lng: number;
  line: 'blue' | 'gold';
}

export const lightRailStations: LightRailStation[] = [
  // LYNX Blue Line (south to north)
  { name: "I-485/South Boulevard", lat: 35.1073, lng: -80.8819, line: "blue" },
  { name: "Sharon Road West", lat: 35.1175, lng: -80.8815, line: "blue" },
  { name: "Arrowood", lat: 35.1310, lng: -80.8790, line: "blue" },
  { name: "Archdale", lat: 35.1480, lng: -80.8770, line: "blue" },
  { name: "Tyvola", lat: 35.1620, lng: -80.8740, line: "blue" },
  { name: "Woodlawn", lat: 35.1730, lng: -80.8720, line: "blue" },
  { name: "Scaleybark", lat: 35.1930, lng: -80.8720, line: "blue" },
  { name: "New Bern", lat: 35.1990, lng: -80.8690, line: "blue" },
  { name: "East/West Boulevard", lat: 35.2040, lng: -80.8640, line: "blue" },
  { name: "Bland Street", lat: 35.2120, lng: -80.8570, line: "blue" },
  { name: "Carson", lat: 35.2180, lng: -80.8510, line: "blue" },
  { name: "Brooklyn Village", lat: 35.2210, lng: -80.8470, line: "blue" },
  { name: "3rd Street/Convention Center", lat: 35.2240, lng: -80.8430, line: "blue" },
  { name: "CTC/Arena", lat: 35.2270, lng: -80.8400, line: "blue" },
  { name: "7th Street", lat: 35.2290, lng: -80.8370, line: "blue" },
  { name: "9th Street", lat: 35.2320, lng: -80.8340, line: "blue" },
  { name: "Parkwood", lat: 35.2340, lng: -80.8300, line: "blue" },
  { name: "25th Street", lat: 35.2380, lng: -80.8240, line: "blue" },
  { name: "36th Street", lat: 35.2480, lng: -80.8060, line: "blue" },
  { name: "Sugar Creek", lat: 35.2560, lng: -80.8020, line: "blue" },
  { name: "Old Concord Road", lat: 35.2680, lng: -80.7930, line: "blue" },
  { name: "Tom Hunter", lat: 35.2810, lng: -80.7830, line: "blue" },
  { name: "University City Boulevard", lat: 35.2950, lng: -80.7700, line: "blue" },
  { name: "McCullough", lat: 35.3050, lng: -80.7580, line: "blue" },
  { name: "JW Clay Blvd/UNC Charlotte", lat: 35.3120, lng: -80.7430, line: "blue" },
  { name: "UNC Charlotte Main", lat: 35.3110, lng: -80.7330, line: "blue" },

  // CityLYNX Gold Line (west to east)
  { name: "French Street", lat: 35.2340, lng: -80.8620, line: "gold" },
  { name: "Johnson C. Smith University", lat: 35.2330, lng: -80.8570, line: "gold" },
  { name: "Bruns Avenue", lat: 35.2310, lng: -80.8530, line: "gold" },
  { name: "Wesley Heights", lat: 35.2300, lng: -80.8490, line: "gold" },
  { name: "Irwin Avenue", lat: 35.2290, lng: -80.8450, line: "gold" },
  { name: "Johnson & Wales University", lat: 35.2280, lng: -80.8420, line: "gold" },
  { name: "Charlotte Gateway Station", lat: 35.2270, lng: -80.8390, line: "gold" },
  { name: "Mint Street", lat: 35.2268, lng: -80.8450, line: "gold" },
  { name: "Tryon Street", lat: 35.2270, lng: -80.8410, line: "gold" },
  { name: "CTC/Trade Street", lat: 35.2270, lng: -80.8390, line: "gold" },
  { name: "Davidson Street", lat: 35.2260, lng: -80.8350, line: "gold" },
  { name: "McDowell Street", lat: 35.2250, lng: -80.8320, line: "gold" },
  { name: "Hawthorne & 5th Street", lat: 35.2230, lng: -80.8270, line: "gold" },
  { name: "8th Street", lat: 35.2220, lng: -80.8230, line: "gold" },
  { name: "CPCC", lat: 35.2200, lng: -80.8190, line: "gold" },
  { name: "Elizabeth & Hawthorne", lat: 35.2180, lng: -80.8140, line: "gold" },
  { name: "Sunnyside Avenue", lat: 35.2160, lng: -80.8100, line: "gold" },
];
