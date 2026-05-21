import fs from 'fs';

// LYNX Blue Line stations (south to north)
const blueLineStations = [
  { name: "I-485/South Boulevard", lat: 35.1073, lng: -80.8819 },
  { name: "Sharon Road West", lat: 35.1175, lng: -80.8815 },
  { name: "Arrowood", lat: 35.1310, lng: -80.8790 },
  { name: "Archdale", lat: 35.1480, lng: -80.8770 },
  { name: "Tyvola", lat: 35.1620, lng: -80.8740 },
  { name: "Woodlawn", lat: 35.1730, lng: -80.8720 },
  { name: "Scaleybark", lat: 35.1930, lng: -80.8720 },
  { name: "New Bern", lat: 35.1990, lng: -80.8690 },
  { name: "East/West Boulevard", lat: 35.2040, lng: -80.8640 },
  { name: "Bland Street", lat: 35.2120, lng: -80.8570 },
  { name: "Carson", lat: 35.2180, lng: -80.8510 },
  { name: "Brooklyn Village", lat: 35.2210, lng: -80.8470 },
  { name: "3rd Street/Convention Center", lat: 35.2240, lng: -80.8430 },
  { name: "CTC/Arena", lat: 35.2270, lng: -80.8400 },
  { name: "7th Street", lat: 35.2290, lng: -80.8370 },
  { name: "9th Street", lat: 35.2320, lng: -80.8340 },
  { name: "Parkwood", lat: 35.2340, lng: -80.8300 },
  { name: "25th Street", lat: 35.2380, lng: -80.8240 },
  { name: "36th Street", lat: 35.2480, lng: -80.8060 },
  { name: "Sugar Creek", lat: 35.2560, lng: -80.8020 },
  { name: "Old Concord Road", lat: 35.2680, lng: -80.7930 },
  { name: "Tom Hunter", lat: 35.2810, lng: -80.7830 },
  { name: "University City Boulevard", lat: 35.2950, lng: -80.7700 },
  { name: "McCullough", lat: 35.3050, lng: -80.7580 },
  { name: "JW Clay Boulevard/UNC Charlotte", lat: 35.3120, lng: -80.7430 },
  { name: "UNC Charlotte Main", lat: 35.3110, lng: -80.7330 },
];

// CityLYNX Gold Line stations (west to east)
const goldLineStations = [
  { name: "French Street", lat: 35.2340, lng: -80.8620 },
  { name: "Johnson C. Smith University", lat: 35.2330, lng: -80.8570 },
  { name: "Bruns Avenue", lat: 35.2310, lng: -80.8530 },
  { name: "Wesley Heights", lat: 35.2300, lng: -80.8490 },
  { name: "Irwin Avenue", lat: 35.2290, lng: -80.8450 },
  { name: "Johnson & Wales University", lat: 35.2280, lng: -80.8420 },
  { name: "Charlotte Gateway Station", lat: 35.2270, lng: -80.8390 },
  { name: "Mint Street", lat: 35.2270, lng: -80.8450 },
  { name: "Tryon Street", lat: 35.2270, lng: -80.8410 },
  { name: "CTC/Trade Street", lat: 35.2270, lng: -80.8390 },
  { name: "Davidson Street", lat: 35.2260, lng: -80.8350 },
  { name: "McDowell Street", lat: 35.2250, lng: -80.8320 },
  { name: "Hawthorne & 5th Street", lat: 35.2230, lng: -80.8270 },
  { name: "8th Street", lat: 35.2220, lng: -80.8230 },
  { name: "CPCC", lat: 35.2200, lng: -80.8190 },
  { name: "Elizabeth & Hawthorne", lat: 35.2180, lng: -80.8140 },
  { name: "Sunnyside Avenue", lat: 35.2160, lng: -80.8100 },
];

// All apartment data
const apartments = [
  { name: "The Kimberlee", url: "https://www.thekimberlee.com/", address: "1300 Reece Rd, Charlotte, NC 28209", neighborhood: "Montford", lat: 35.1756, lng: -80.8481, rentMin: 1200, rentMax: 1600, score: 7.1 },
  { name: "Fountains South End", url: "https://fountainssouthend.irtliving.com/charlotte/fountains-southend/", address: "126 New Bern St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.199, lng: -80.8699, rentMin: 1439, rentMax: 2100, score: 9.2 },
  { name: "Elizabeth Square", url: "https://www.elizabethsquare.com/", address: "730 Hawthorne Ln, Charlotte, NC 28204", neighborhood: "Elizabeth", lat: 35.2193, lng: -80.8188, rentMin: 1219, rentMax: 2210, score: 7.6 },
  { name: "Cielo", url: "https://www.cielocharlotte.com/", address: "4943 Park Rd, Charlotte, NC 28209", neighborhood: "Park Road", lat: 35.1633, lng: -80.8487, rentMin: 1291, rentMax: 2089, score: 7.6 },
  { name: "Elmhurst at Sedgefield", url: "https://www.marshproperties.com/community/elmhurst-at-sedgefield/", address: "215 Poindexter Dr, Charlotte, NC 28209", neighborhood: "Sedgefield", lat: 35.201, lng: -80.8653, rentMin: 1475, rentMax: 1650, score: 7.5 },
  { name: "Highland Mill Lofts", url: "https://www.highlandmill.com/", address: "2901 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.246, lng: -80.8101, rentMin: 1499, rentMax: 1803, score: 8.2 },
  { name: "NoDa Flats", url: "https://www.nodaflats.com/", address: "2509 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2421, lng: -80.8123, rentMin: 1340, rentMax: 1870, score: 8.2 },
  { name: "The Julien", url: "https://www.thejulien.com/", address: "2142 Commonwealth Ave, Charlotte, NC 28205", neighborhood: "Plaza Midwood", lat: 35.2174, lng: -80.8098, rentMin: 1449, rentMax: 2750, score: 7.8 },
  { name: "Abbey Court Apartments", url: "https://www.marshproperties.com/apartments/abbey-court/", address: "4420 Abbey Pl, Charlotte, NC 28209", neighborhood: "Montford", lat: 35.1693, lng: -80.8483, rentMin: 1100, rentMax: 1400, score: 7.3 },
  { name: "The Willows", url: "https://www.partnershippm.com/community/the-willows/", address: "1614 Ideal Way, Charlotte, NC 28209", neighborhood: "Sedgefield", lat: 35.1983, lng: -80.8437, rentMin: 1200, rentMax: 1450, score: 7.1 },
  { name: "Madison Southpark", url: "https://www.madisonsouthpark.com/", address: "4605 Colony Rd, Charlotte, NC 28209", neighborhood: "Southpark", lat: 35.1459, lng: -80.8178, rentMin: 1100, rentMax: 1500, score: 6.8 },
  { name: "Alpha Mill", url: "https://www.alphamillapartments.com/", address: "220 Alpha Mill Ln, Charlotte, NC 28206", neighborhood: "Optimist Park", lat: 35.2317, lng: -80.8319, rentMin: 1099, rentMax: 2463, score: 7.4 },
  { name: "The Griff", url: "https://www.thegriffclt.com/", address: "1835 Morehead Ridge Dr, Charlotte, NC 28208", neighborhood: "LoSo", lat: 35.229, lng: -80.8708, rentMin: 1383, rentMax: 3096, score: 6.9 },
  { name: "MAA LoSo", url: "https://www.maac.com/north-carolina/charlotte/maa-loso/", address: "4015 Craft St, Charlotte, NC 28217", neighborhood: "LoSo", lat: 35.1925, lng: -80.8752, rentMin: 1238, rentMax: 2500, score: 6.9 },
  { name: "The Marley", url: "https://www.livethemarley.com/", address: "1100 Falls Creek Ln, Charlotte, NC 28209", neighborhood: "LoSo", lat: 35.1784, lng: -80.8632, rentMin: 1110, rentMax: 1800, score: 6.2 },
  { name: "Alexan LoSo", url: "https://alexanloso.com/", address: "3305 South Blvd, Charlotte, NC 28209", neighborhood: "LoSo", lat: 35.1956, lng: -80.8717, rentMin: 1317, rentMax: 2209, score: 8.0 },
  { name: "The Atherton", url: "https://www.greystar.com/properties/charlotte-nc/the-atherton", address: "2100 South Blvd, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2081, lng: -80.8603, rentMin: 1520, rentMax: 3126, score: 9.4 },
  { name: "Camden Southline", url: "https://www.camdenliving.com/apartments/charlotte-nc/camden-southline", address: "2300 South Blvd, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2059, lng: -80.8634, rentMin: 1629, rentMax: 2200, score: 9.1 },
  { name: "Mosaic South End", url: "https://www.mosaicsouthend.com/", address: "1312 S College St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2177, lng: -80.8536, rentMin: 1373, rentMax: 2932, score: 9.1 },
  { name: "The Sloan at LoSo", url: "https://thesloanloso.com/", address: "120 Hollis Rd, Charlotte, NC 28209", neighborhood: "LoSo", lat: 35.1927, lng: -80.8727, rentMin: 1416, rentMax: 2979, score: 7.9 },
  { name: "Leo LoSo", url: "https://www.bipinc.com/apartment/the-leo-loso/", address: "4520 Charlotte Park Dr, Charlotte, NC 28217", neighborhood: "LoSo", lat: 35.1853, lng: -80.8903, rentMin: 1250, rentMax: 1870, score: 6.7 },
  { name: "Camden South End", url: "https://www.camdenliving.com/apartments/charlotte-nc/camden-south-end", address: "1205 S Tryon St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2189, lng: -80.8532, rentMin: 1569, rentMax: 2100, score: 9.4 },
  { name: "Wildwood Apartments", url: "https://www.livewildwoodapts.com/", address: "1022 Forest Oak Dr, Charlotte, NC 28209", neighborhood: "Sedgefield", lat: 35.1763, lng: -80.8615, rentMin: 999, rentMax: 1679, score: 6.9 },
  { name: "Selwyn Flats", url: "https://selwynflats.com/", address: "100 Matador Ln, Charlotte, NC 28209", neighborhood: "Myers Park", lat: 35.1658, lng: -80.8434, rentMin: 1224, rentMax: 1324, score: 7.0 },
  { name: "1010 Dilworth", url: "https://www.cr-1010dilworthapts.com/", address: "1010 Kenilworth Ave, Charlotte, NC 28204", neighborhood: "Dilworth", lat: 35.2083, lng: -80.8408, rentMin: 1275, rentMax: 2879, score: 8.5 },
  { name: "Camden Dilworth", url: "https://www.camdenliving.com/apartments/charlotte-nc/camden-dilworth", address: "1510 Scott Ave, Charlotte, NC 28203", neighborhood: "Dilworth", lat: 35.2035, lng: -80.8416, rentMin: 1319, rentMax: 2200, score: 8.5 },
  { name: "Berkshire Dilworth", url: "https://www.berkshirecommunities.com/apartments/nc/charlotte/berkshire-dilworth/default", address: "1351 E Morehead St, Charlotte, NC 28204", neighborhood: "Dilworth", lat: 35.2067, lng: -80.8378, rentMin: 1200, rentMax: 3964, score: 8.3 },
  { name: "Solis Midtown", url: "https://solismidtown.com/", address: "1133 Harding Pl, Charlotte, NC 28204", neighborhood: "Midtown", lat: 35.2113, lng: -80.8402, rentMin: 1310, rentMax: 4514, score: 7.8 },
  { name: "The Francis", url: "https://thefrancisuptown.com/", address: "400 E Brooklyn Village Ave, Charlotte, NC 28202", neighborhood: "Uptown", lat: 35.2213, lng: -80.8465, rentMin: 1358, rentMax: 3500, score: 9.1 },
  { name: "Camden Gallery", url: "https://www.camdenliving.com/apartments/charlotte-nc/camden-gallery", address: "200 Wesley Heights Way, Charlotte, NC 28208", neighborhood: "Uptown", lat: 35.2371, lng: -80.8603, rentMin: 1449, rentMax: 2400, score: 8.5 },
  { name: "MAA Sedgefield", url: "https://www.maac.com/north-carolina/charlotte/maa-sedgefield/", address: "301 E Woodlawn Rd, Charlotte, NC 28209", neighborhood: "Sedgefield", lat: 35.178, lng: -80.8792, rentMin: 1200, rentMax: 2100, score: 7.6 },
  { name: "Union NoDa", url: "https://unionnoda.com/", address: "2226 N Davidson St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2395, lng: -80.8143, rentMin: 1267, rentMax: 3425, score: 8.2 },
  { name: "NoDa Wandry", url: "https://www.greystar.com/noda-wandry-charlotte-nc/p_19847", address: "423 E 36th St, Charlotte, NC 28205", neighborhood: "NoDa", lat: 35.2484, lng: -80.8049, rentMin: 1154, rentMax: 3094, score: 8.2 },
  { name: "Amaze at NoDa", url: "https://amazeaptsnoda.prospectportal.com/charlotte/amaze-noda/", address: "3750 Philemon Ave, Charlotte, NC 28206", neighborhood: "NoDa", lat: 35.2517, lng: -80.7987, rentMin: 1047, rentMax: 2293, score: 7.5 },
  { name: "MAA Plaza Midwood", url: "https://www.maac.com/north-carolina/charlotte/maa-plaza-midwood/", address: "620 Seigle Ave, Charlotte, NC 28204", neighborhood: "Plaza Midwood", lat: 35.223, lng: -80.8261, rentMin: 1393, rentMax: 3343, score: 7.8 },
  { name: "Foster Flats", url: "https://www.fosterflats.com/", address: "205 Foster Ave, Charlotte, NC 28203", neighborhood: "South End", lat: 35.1991, lng: -80.8715, rentMin: 1390, rentMax: 2800, score: 9.4 },
  { name: "South and Hollis", url: "https://www.southandhollis.com/", address: "3441 South Blvd, Charlotte, NC 28209", neighborhood: "LoSo", lat: 35.1934, lng: -80.8724, rentMin: 1400, rentMax: 2800, score: 8.0 },
  { name: "Ello House", url: "https://ellohouseloso.com/", address: "3615 Tryclan Dr, Charlotte, NC 28217", neighborhood: "LoSo", lat: 35.1938, lng: -80.8765, rentMin: 1300, rentMax: 2400, score: 7.0 },
  { name: "Bradham at New Bern", url: "https://bradhamnewbern.com/", address: "145 New Bern St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.1998, lng: -80.8675, rentMin: 1450, rentMax: 2900, score: 9.4 },
  { name: "Selene at Southline", url: "https://www.seleneatsouthline.com/", address: "2520 South Blvd, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2033, lng: -80.865, rentMin: 1400, rentMax: 2600, score: 9.1 },
  { name: "Avalon South End", url: "https://www.avaloncommunities.com/north-carolina/charlotte-apartments/avalon-south-end/", address: "2250 Hawkins St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.208, lng: -80.8647, rentMin: 1475, rentMax: 3495, score: 9.4 },
  { name: "Edge @ NoDa", url: "https://www.edgenodacharlotte.com/", address: "229 Hilo Dr, Charlotte, NC 28206", neighborhood: "NoDa", lat: 35.2567, lng: -80.8048, rentMin: 1100, rentMax: 1500, score: 6.9 },
  { name: "Link Apartments NoDa 36th", url: "https://www.linkapartmentsnoda36th.com/", address: "3500 Philemon Ave, Charlotte, NC 28206", neighborhood: "NoDa", lat: 35.2503, lng: -80.8048, rentMin: 1126, rentMax: 2500, score: 8.2 },
  { name: "One NoDa Park", url: "https://onenodapark.com/", address: "110 E 36th St, Charlotte, NC 28206", neighborhood: "NoDa", lat: 35.2519, lng: -80.8094, rentMin: 1229, rentMax: 3195, score: 8.2 },
  { name: "AVA South End", url: "https://www.avaloncommunities.com/north-carolina/charlotte-apartments/ava-south-end/", address: "335 Doggett St, Charlotte, NC 28203", neighborhood: "South End", lat: 35.2116, lng: -80.8649, rentMin: 1305, rentMax: 2720, score: 9.0 },
  { name: "Lincoln at Dilworth", url: "https://lincolnatdilworth.com/", address: "905 Kenilworth Ave, Charlotte, NC 28204", neighborhood: "Dilworth", lat: 35.2082, lng: -80.8389, rentMin: 1299, rentMax: 2959, score: 8.5 },
  { name: "MAA Optimist Park", url: "https://www.maac.com/north-carolina/charlotte/maa-optimist-park/", address: "525 E 21st St, Charlotte, NC 28206", neighborhood: "Optimist Park", lat: 35.2369, lng: -80.8204, rentMin: 1353, rentMax: 2853, score: 7.8 },
  { name: "Camden NoDa", url: "https://www.camdenliving.com/apartments/charlotte-nc/camden-noda", address: "515 Jordan Pl, Charlotte, NC 28205", neighborhood: "Villa Heights", lat: 35.2426, lng: -80.8117, rentMin: 1349, rentMax: 1609, score: 7.8 },
  { name: "SouthPark Morrison", url: "https://www.southparkmorrison.com/", address: "721 Governor Morrison St, Charlotte, NC 28211", neighborhood: "SouthPark", lat: 35.1572, lng: -80.8257, rentMin: 1243, rentMax: 2058, score: 6.8 },
  { name: "MAA South Park", url: "https://www.maac.com/north-carolina/charlotte/maa-south-park/", address: "4835 Cameron Valley Pkwy, Charlotte, NC 28210", neighborhood: "SouthPark", lat: 35.1449, lng: -80.8261, rentMin: 1210, rentMax: 2210, score: 6.0 },
];

function getStyle(score) {
  if (score >= 9.0) return 'green';
  if (score >= 8.0) return 'yellow';
  if (score >= 7.0) return 'orange';
  return 'red';
}

function getTier(score) {
  if (score >= 9.0) return '⭐ Score 9.0+ (Green)';
  if (score >= 8.0) return '🟡 Score 8.0–8.9 (Yellow)';
  if (score >= 7.0) return '🟠 Score 7.0–7.9 (Orange)';
  return '🔴 Score below 7.0 (Red)';
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Group apartments by tier
const tiers = {};
apartments.forEach(a => {
  const tier = getTier(a.score);
  if (!tiers[tier]) tiers[tier] = [];
  tiers[tier].push(a);
});
Object.values(tiers).forEach(arr => arr.sort((a, b) => b.score - a.score));

let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>Charlotte Apartments + Light Rail</name>
  <description>Apartments color-coded by score + LYNX Blue Line and CityLYNX Gold Line stations</description>

  <Style id="green">
    <IconStyle><scale>1.1</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href></Icon></IconStyle>
  </Style>
  <Style id="yellow">
    <IconStyle><scale>1.0</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png</href></Icon></IconStyle>
  </Style>
  <Style id="orange">
    <IconStyle><scale>0.9</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/orange-circle.png</href></Icon></IconStyle>
  </Style>
  <Style id="red">
    <IconStyle><scale>0.9</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href></Icon></IconStyle>
  </Style>
  <Style id="blueLine">
    <IconStyle><scale>0.8</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/blu-square.png</href></Icon></IconStyle>
  </Style>
  <Style id="goldLine">
    <IconStyle><scale>0.8</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-square.png</href></Icon></IconStyle>
  </Style>
`;

// Apartment folders
const tierOrder = ['⭐ Score 9.0+ (Green)', '🟡 Score 8.0–8.9 (Yellow)', '🟠 Score 7.0–7.9 (Orange)', '🔴 Score below 7.0 (Red)'];
tierOrder.forEach(tierName => {
  const arr = tiers[tierName] || [];
  kml += `\n  <Folder>\n    <name>${tierName}</name>\n`;
  arr.forEach(a => {
    const rent = a.rentMax ? `$${a.rentMin.toLocaleString()}–$${a.rentMax.toLocaleString()}` : `$${a.rentMin.toLocaleString()}+`;
    kml += `    <Placemark>\n`;
    kml += `      <name>${escapeXml(a.name)} (${a.score})</name>\n`;
    kml += `      <description><![CDATA[<b>${escapeXml(a.name)}</b><br>${escapeXml(a.address)}<br>${a.neighborhood} | ${rent} | Score: ${a.score}<br><br><a href="${a.url}" target="_blank">Visit Website</a>]]></description>\n`;
    kml += `      <styleUrl>#${getStyle(a.score)}</styleUrl>\n`;
    kml += `      <Point><coordinates>${a.lng},${a.lat},0</coordinates></Point>\n`;
    kml += `    </Placemark>\n`;
  });
  kml += `  </Folder>\n`;
});

// Blue Line folder
kml += `\n  <Folder>\n    <name>🔵 LYNX Blue Line Stations</name>\n`;
blueLineStations.forEach(s => {
  kml += `    <Placemark>\n`;
  kml += `      <name>🚇 ${escapeXml(s.name)}</name>\n`;
  kml += `      <description><![CDATA[<b>LYNX Blue Line</b><br>${escapeXml(s.name)} Station]]></description>\n`;
  kml += `      <styleUrl>#blueLine</styleUrl>\n`;
  kml += `      <Point><coordinates>${s.lng},${s.lat},0</coordinates></Point>\n`;
  kml += `    </Placemark>\n`;
});
kml += `  </Folder>\n`;

// Gold Line folder
kml += `\n  <Folder>\n    <name>🟡 CityLYNX Gold Line Stations</name>\n`;
goldLineStations.forEach(s => {
  kml += `    <Placemark>\n`;
  kml += `      <name>🚋 ${escapeXml(s.name)}</name>\n`;
  kml += `      <description><![CDATA[<b>CityLYNX Gold Line</b><br>${escapeXml(s.name)} Station]]></description>\n`;
  kml += `      <styleUrl>#goldLine</styleUrl>\n`;
  kml += `      <Point><coordinates>${s.lng},${s.lat},0</coordinates></Point>\n`;
  kml += `    </Placemark>\n`;
});
kml += `  </Folder>\n`;

kml += `\n</Document>\n</kml>\n`;

fs.writeFileSync('apartments.kml', kml);
console.log(`Generated apartments.kml with ${apartments.length} apartments, ${blueLineStations.length} Blue Line stations, ${goldLineStations.length} Gold Line stations`);
