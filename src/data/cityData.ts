export interface CityHub {
  name: string;
  area: string;
  type: 'Commercial' | 'Residential' | 'Industrial' | 'Warehouse' | 'Market';
  fullAddress: string;
  landmark: string;
  lat: number;
  lng: number;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  tagline: string;
  popularHubs: CityHub[];
  defaultPickup: string;
  defaultDrop: string;
  defaultDistanceKm: number;
  activeVehiclesCount: number;
  avgPickupTimeMin: number;
}

export const INDIAN_CITIES: CityConfig[] = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    tagline: 'Instant intra-city freight across MMR & Navi Mumbai',
    defaultPickup: 'Andheri West (Lokhandwala Complex), Mumbai',
    defaultDrop: 'Bandra Kurla Complex (BKC G-Block), Mumbai',
    defaultDistanceKm: 14.2,
    activeVehiclesCount: 1420,
    avgPickupTimeMin: 7,
    popularHubs: [
      {
        name: 'Andheri West',
        area: 'Western Suburbs',
        type: 'Commercial',
        fullAddress: 'Infiniti Mall Link Road, Andheri West, Mumbai, 400053',
        landmark: 'Opposite Star Bazar',
        lat: 19.1363,
        lng: 72.8277
      },
      {
        name: 'Bandra Kurla Complex (BKC)',
        area: 'Central Business District',
        type: 'Commercial',
        fullAddress: 'G Block, Bandra Kurla Complex, Bandra East, Mumbai, 400051',
        landmark: 'Near Bharat Diamond Bourse',
        lat: 19.0664,
        lng: 72.8687
      },
      {
        name: 'Lower Parel',
        area: 'South Central Mumbai',
        type: 'Commercial',
        fullAddress: 'Senapati Bapat Marg, Lower Parel, Mumbai, 400013',
        landmark: 'Near High Street Phoenix',
        lat: 19.0016,
        lng: 72.8306
      },
      {
        name: 'Powai Hiranandani',
        area: 'Eastern Suburbs',
        type: 'Residential',
        fullAddress: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai, 400076',
        landmark: 'Near Galleria Shopping Mall',
        lat: 19.1197,
        lng: 72.9051
      },
      {
        name: 'Dadar TT Circle',
        area: 'Central Mumbai',
        type: 'Market',
        fullAddress: 'Swami Vivekanand Road, Dadar East, Mumbai, 400014',
        landmark: 'Near Dadar Flower Market',
        lat: 19.0178,
        lng: 72.8478
      },
      {
        name: 'Vashi APMC Market',
        area: 'Navi Mumbai',
        type: 'Warehouse',
        fullAddress: 'Sector 19, APMC Grain Market, Vashi, Navi Mumbai, 400703',
        landmark: 'Near APMC Fruit & Vegetable Market',
        lat: 19.0744,
        lng: 72.9978
      },
      {
        name: 'Goregaon East Nesco',
        area: 'Western Suburbs',
        type: 'Industrial',
        fullAddress: 'Western Express Highway, Nesco IT Park, Goregaon East, Mumbai, 400063',
        landmark: 'Next to Nesco Exhibition Centre',
        lat: 19.1553,
        lng: 72.8542
      },
      {
        name: 'Thane Ghodbunder Road',
        area: 'Thane City',
        type: 'Residential',
        fullAddress: 'Waghbil Naka, Ghodbunder Road, Thane West, 400615',
        landmark: 'Near Suraj Water Park',
        lat: 19.2612,
        lng: 72.9734
      }
    ]
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    tagline: 'Tech corridors, industrial estates & residential shifting',
    defaultPickup: 'Indiranagar (100 Feet Road), Bengaluru',
    defaultDrop: 'Whitefield (ITPL Main Road), Bengaluru',
    defaultDistanceKm: 16.5,
    activeVehiclesCount: 1680,
    avgPickupTimeMin: 6,
    popularHubs: [
      {
        name: 'Indiranagar',
        area: 'East Bengaluru',
        type: 'Commercial',
        fullAddress: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, 560038',
        landmark: 'Near Toit Brewpub',
        lat: 12.9784,
        lng: 77.6408
      },
      {
        name: 'Koramangala 5th Block',
        area: 'South Bengaluru',
        type: 'Commercial',
        fullAddress: 'Jyoti Nivas College Road, Koramangala 5th Block, Bengaluru, 560095',
        landmark: 'Near Sony World Signal',
        lat: 12.9352,
        lng: 77.6245
      },
      {
        name: 'Whitefield ITPL',
        area: 'Tech Corridor',
        type: 'Commercial',
        fullAddress: 'International Tech Park, Whitefield Main Road, Bengaluru, 560066',
        landmark: 'Near Park Square Mall',
        lat: 12.9866,
        lng: 77.7378
      },
      {
        name: 'HSR Layout Sector 1',
        area: 'South East Bengaluru',
        type: 'Residential',
        fullAddress: '27th Main Road, Sector 1, HSR Layout, Bengaluru, 560102',
        landmark: 'Near Agara Lake Junction',
        lat: 12.9121,
        lng: 77.6446
      },
      {
        name: 'Electronic City Phase 1',
        area: 'Tech Corridor',
        type: 'Industrial',
        fullAddress: 'Hosur Road, Keonics Electronic City Phase 1, Bengaluru, 560100',
        landmark: 'Near Wipro Gate 1',
        lat: 12.8452,
        lng: 77.6602
      },
      {
        name: 'Peenya Industrial Area',
        area: 'North Bengaluru',
        type: 'Warehouse',
        fullAddress: '2nd Stage, Peenya Industrial Area, Bengaluru, 560058',
        landmark: 'Near Peenya Metro Station',
        lat: 13.0315,
        lng: 77.5142
      },
      {
        name: 'Commercial Street',
        area: 'Central Bengaluru',
        type: 'Market',
        fullAddress: 'Shop Row, Tasker Town, Shivaji Nagar, Bengaluru, 560001',
        landmark: 'Near Kamraj Road Crossing',
        lat: 12.9822,
        lng: 77.6083
      }
    ]
  },
  {
    id: 'delhi_ncr',
    name: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    tagline: 'Connecting Delhi, Gurugram, Noida, Faridabad & Ghaziabad',
    defaultPickup: 'Connaught Place (Inner Circle), New Delhi',
    defaultDrop: 'DLF Cyber Hub (Cyber City), Gurugram',
    defaultDistanceKm: 27.8,
    activeVehiclesCount: 2150,
    avgPickupTimeMin: 8,
    popularHubs: [
      {
        name: 'Connaught Place',
        area: 'Central Delhi',
        type: 'Commercial',
        fullAddress: 'Barakhamba Road, Connaught Place, New Delhi, 110001',
        landmark: 'Near Statesman House',
        lat: 28.6304,
        lng: 77.2177
      },
      {
        name: 'DLF Cyber City',
        area: 'Gurugram',
        type: 'Commercial',
        fullAddress: 'DLF Phase 2, DLF Cyber Hub, Gurugram, Haryana, 122002',
        landmark: 'Near Rapid Metro Cyber City',
        lat: 28.4952,
        lng: 77.0891
      },
      {
        name: 'Sector 18 Noida',
        area: 'Noida',
        type: 'Commercial',
        fullAddress: 'Atta Market, Sector 18, Noida, Uttar Pradesh, 201301',
        landmark: 'Opposite DLF Mall of India',
        lat: 28.5708,
        lng: 77.3271
      },
      {
        name: 'Okhla Industrial Area Ph 3',
        area: 'South Delhi',
        type: 'Industrial',
        fullAddress: 'Modi Mill Compound, Okhla Phase 3, New Delhi, 110020',
        landmark: 'Near NSIC Okhla Metro Station',
        lat: 28.5472,
        lng: 77.2689
      },
      {
        name: 'Chandni Chowk Wholesale',
        area: 'Old Delhi',
        type: 'Market',
        fullAddress: 'Katra Neel, Chandni Chowk, Delhi, 110006',
        landmark: 'Near Town Hall',
        lat: 28.6562,
        lng: 77.2304
      }
    ]
  },
  {
    id: 'pune',
    name: 'Pune',
    state: 'Maharashtra',
    tagline: 'Auto hubs, IT parks, retail distribution & home relocation',
    defaultPickup: 'Hinjawadi Phase 1 (Infotech Park), Pune',
    defaultDrop: 'Koregaon Park (North Main Road), Pune',
    defaultDistanceKm: 21.4,
    activeVehiclesCount: 890,
    avgPickupTimeMin: 9,
    popularHubs: [
      {
        name: 'Hinjawadi Phase 1',
        area: 'West Pune',
        type: 'Commercial',
        fullAddress: 'Rajiv Gandhi Infotech Park, Hinjawadi Phase 1, Pune, 411057',
        landmark: 'Near Shivaji Chowk',
        lat: 18.5913,
        lng: 73.7389
      },
      {
        name: 'Koregaon Park',
        area: 'East Pune',
        type: 'Residential',
        fullAddress: 'Lane 7, North Main Road, Koregaon Park, Pune, 411001',
        landmark: 'Near German Bakery',
        lat: 18.5362,
        lng: 73.8941
      },
      {
        name: 'Bhosari MIDC',
        area: 'Pimpri-Chinchwad',
        type: 'Industrial',
        fullAddress: 'General Block, Bhosari Industrial Area, Pune, 411026',
        landmark: 'Near Telco Road',
        lat: 18.6298,
        lng: 73.8445
      },
      {
        name: 'Viman Nagar',
        area: 'East Pune',
        type: 'Commercial',
        fullAddress: 'New Airport Road, Viman Nagar, Pune, 411014',
        landmark: 'Near Phoenix Marketcity',
        lat: 18.5679,
        lng: 73.9143
      }
    ]
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    state: 'Telangana',
    tagline: 'Twin cities intra-freight with verified local captains',
    defaultPickup: 'HITEC City (Cyber Towers), Hyderabad',
    defaultDrop: 'Secunderabad Railway Station Area, Hyderabad',
    defaultDistanceKm: 19.8,
    activeVehiclesCount: 1120,
    avgPickupTimeMin: 8,
    popularHubs: [
      {
        name: 'HITEC City Cyber Towers',
        area: 'Madhapur',
        type: 'Commercial',
        fullAddress: 'Hitech City Main Road, Cyber Towers, Madhapur, Hyderabad, 500081',
        landmark: 'Near Cyber Gateway',
        lat: 17.4504,
        lng: 78.3808
      },
      {
        name: 'Gachibowli Financial District',
        area: 'Gachibowli',
        type: 'Commercial',
        fullAddress: 'ISB Road, Nanakramguda, Financial District, Hyderabad, 500032',
        landmark: 'Near Waverock SEZ',
        lat: 17.4194,
        lng: 78.3456
      },
      {
        name: 'Banjara Hills Road No 12',
        area: 'Central Hyderabad',
        type: 'Residential',
        fullAddress: 'Ministers Colony, Banjara Hills Road No 12, Hyderabad, 500034',
        landmark: 'Near MLA Colony Junction',
        lat: 17.4123,
        lng: 78.4321
      },
      {
        name: 'Begum Bazar Wholesale',
        area: 'Old City',
        type: 'Market',
        fullAddress: 'Feelkhana, Begum Bazar, Hyderabad, 500012',
        landmark: 'Near Fish Market Crossroad',
        lat: 17.3753,
        lng: 78.4712
      }
    ]
  },
  {
    id: 'chennai',
    name: 'Chennai',
    state: 'Tamil Nadu',
    tagline: 'Port logistics, industrial corridors & retail delivery',
    defaultPickup: 'T Nagar (Ranganathan Street), Chennai',
    defaultDrop: 'OMR IT Corridor (Thoraipakkam), Chennai',
    defaultDistanceKm: 15.6,
    activeVehiclesCount: 940,
    avgPickupTimeMin: 8,
    popularHubs: [
      {
        name: 'T Nagar',
        area: 'Central Chennai',
        type: 'Market',
        fullAddress: 'Usman Road, T Nagar, Chennai, Tamil Nadu, 600017',
        landmark: 'Near Panagal Park',
        lat: 13.0418,
        lng: 80.2341
      },
      {
        name: 'OMR Thoraipakkam',
        area: 'South Chennai',
        type: 'Commercial',
        fullAddress: 'Rajiv Gandhi Salai, Thoraipakkam, Chennai, 600097',
        landmark: 'Near Cognizant TCO',
        lat: 12.9352,
        lng: 80.2312
      },
      {
        name: 'Guindy Industrial Estate',
        area: 'Central South',
        type: 'Industrial',
        fullAddress: 'SIDCO Industrial Estate, Guindy, Chennai, 600032',
        landmark: 'Near Kathipara Junction',
        lat: 13.0067,
        lng: 80.2025
      }
    ]
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    state: 'Gujarat',
    tagline: 'Textile distribution, GIDC estates & quick deliveries',
    defaultPickup: 'SG Highway (Prahlad Nagar), Ahmedabad',
    defaultDrop: 'Naroda GIDC Industrial Estate, Ahmedabad',
    defaultDistanceKm: 22.3,
    activeVehiclesCount: 780,
    avgPickupTimeMin: 9,
    popularHubs: [
      {
        name: 'Prahlad Nagar SG Highway',
        area: 'West Ahmedabad',
        type: 'Commercial',
        fullAddress: 'Prahlad Nagar Trade Center, SG Highway, Ahmedabad, 380015',
        landmark: 'Near Prahlad Nagar Garden',
        lat: 23.0125,
        lng: 72.5085
      },
      {
        name: 'Naroda GIDC',
        area: 'East Ahmedabad',
        type: 'Industrial',
        fullAddress: 'Phase 2, Naroda Industrial Estate, Ahmedabad, 382330',
        landmark: 'Near Galaxy Cinema Crossroad',
        lat: 23.0782,
        lng: 72.6641
      },
      {
        name: 'Maskati Cloth Market',
        area: 'Walled City',
        type: 'Market',
        fullAddress: 'Kapad Bazar, Kalupur, Ahmedabad, 380002',
        landmark: 'Near Ahmedabad Railway Station',
        lat: 23.0258,
        lng: 72.5976
      }
    ]
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    tagline: 'Fast logistics across Howrah, Salt Lake & New Town',
    defaultPickup: 'Burrabazar Wholesale Hub, Kolkata',
    defaultDrop: 'Salt Lake Sector V (Tech Hub), Kolkata',
    defaultDistanceKm: 13.8,
    activeVehiclesCount: 820,
    avgPickupTimeMin: 10,
    popularHubs: [
      {
        name: 'Burrabazar Wholesale Hub',
        area: 'Central Kolkata',
        type: 'Market',
        fullAddress: 'Cotton Street, Burrabazar, Kolkata, 700007',
        landmark: 'Near Satyanarayan Park AC Market',
        lat: 22.5855,
        lng: 72.3524
      },
      {
        name: 'Salt Lake Sector V',
        area: 'East Kolkata',
        type: 'Commercial',
        fullAddress: 'College More, Sector V, Salt Lake, Kolkata, 700091',
        landmark: 'Near Webel Bhavan',
        lat: 22.5735,
        lng: 88.4331
      },
      {
        name: 'New Town Rajarhat',
        area: 'Greater Kolkata',
        type: 'Residential',
        fullAddress: 'Action Area 1, Major Arterial Road, New Town, Kolkata, 700156',
        landmark: 'Near Axis Mall',
        lat: 22.5902,
        lng: 88.4712
      }
    ]
  }
];
