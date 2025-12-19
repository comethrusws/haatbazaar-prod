import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const MALL_USER_ID = 'haatbazaar-mall';

// User names
const nepaliNames = [
  'Aarav Sharma','Sita Adhikari','Bikram Thapa','Anita Gurung','Raj Kumar Poudel',
  'Sunita Rai','Bishal Karki','Maya Tamang','Deepak Shrestha','Kabita Bhandari',
  'Suman Koirala','Priya Magar','Rohan Basnet','Sarita Lama','Nabin Chhetri',
  'Gita Pradhan','Ashok Dahal','Kamala Rijal','Suresh Bhattarai','Laxmi Neupane'
];

// Locations
const locations = {
  kathmandu: { lat: 27.7172, lng: 85.3240, region: 'valley' },
  lalitpur: { lat: 27.6588, lng: 85.3247, region: 'valley' },
  bhaktapur: { lat: 27.6710, lng: 85.4298, region: 'valley' },
  pokhara: { lat: 28.2096, lng: 83.9856, region: 'nepal' },
  chitwan: { lat: 27.5291, lng: 84.3542, region: 'nepal' },
  biratnagar: { lat: 26.4525, lng: 87.2718, region: 'nepal' },
  butwal: { lat: 27.7006, lng: 83.4483, region: 'nepal' },
  dharan: { lat: 26.8065, lng: 87.2846, region: 'nepal' },
  janakpur: { lat: 26.7288, lng: 85.9266, region: 'nepal' },
  nepalgunj: { lat: 28.0500, lng: 81.6167, region: 'nepal' },
  delhi: { lat: 28.6139, lng: 77.2090, region: 'foreign' },
  mumbai: { lat: 19.0760, lng: 72.8777, region: 'foreign' },
  bangkok: { lat: 13.7563, lng: 100.5018, region: 'foreign' },
  dubai: { lat: 25.2048, lng: 55.2708, region: 'foreign' },
  singapore: { lat: 1.3521, lng: 103.8198, region: 'foreign' },
  hongkong: { lat: 22.3193, lng: 114.1694, region: 'foreign' },
  tokyo: { lat: 35.6762, lng: 139.6503, region: 'foreign' },
  london: { lat: 51.5074, lng: -0.1278, region: 'foreign' },
  newyork: { lat: 40.7128, lng: -74.0060, region: 'foreign' },
};

const conditions = ['Brand New','Like New','Excellent','Good','Used'];
const colorVariants = ['Black','White','Silver','Gold','Blue','Red','Green','Space Gray','Midnight','Starlight'];

const PRODUCT_IMAGES: Record<string,string> = {
  "Samsung Galaxy S24 Ultra": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766126870/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo_jp9qmn.jpg",
  "iPhone 15 Pro Max": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766126967/iPhone_15_Pro_Max_-_white_titanium-_Overlap_Trans-cropped_jcq3ux.jpg",
  "MacBook Pro 14 M3": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766126949/refurb-mbp14-m3-spacegray-202402_ptr8r0.jpg",
  "Sony WH-1000XM5 Headphones": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766126992/6145c1d32e6ac8e63a46c912dc33c5bb_iao4mt.png",
  "PlayStation 5": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127011/hq720_cfs1ly.jpg",
  "Xbox Series X": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127035/twarren_xboxseriesxhandson.jpg_gpoqit.jpg",
  "Canon EOS R6 Mark II": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127063/Pz6TwXzyakaiAbFUf59eq9_dhumcu.jpg",
  "Nike Air Jordan 1 Retro": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127091/michael_jordan_autographed_nike_air_jordan_1_retro_high_85_varsity_red_95649_k3od3h.jpg",
  "Nespresso Vertuo Next": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127135/71lh9pfr-eL._AC_UF894_1000_QL80__rwvkqq.jpg",
  "Philips Hue Smart Lights": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127112/m_61cf70b360fded56550b123e_mdevhy.jpg",
  "Patagonia Nano Puff Jacket": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127200/86283_Patagonia_Nano_Puffer_Jacket_Raptor_Brown_01.jpg_brcg43.jpg",
};

const USER_PRODUCT_IMAGES: Record<string,string> = {
  "Yamaha R15 V4": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127596/yamaha-r15-v465ec8ed1ba486_atr6sm.webp",
  "Honda Dio Scooter":"https://res.cloudinary.com/dkxec2pei/image/upload/v1766127613/honda-dio-125-31-1718090363_c9pa4x.jpg",
  "Dyson Airwrap Complete": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127640/WEB-308F_H-AW-PDP-Primary-SW_nhiafu.jpg",
  "MAC Lipstick Collection": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127661/mac-lipstick-collection-and-swatches-1440x1440_xgqz25.jpg",
  "Fenty Beauty Foundation": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127728/s1925478-main-zoom_xw6ne2.jpg",
  "Apple AirPods Pro 2": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127703/apple-airpods-pro-2_w71y_cq6tjm.jpg",
  "Rolex Submariner Watch": "https://res.cloudinary.com/dkxec2pei/image/upload/v1766127794/mans-hand-wearing-rolex-submariner-watch-2FKP734_c2w3nr.jpg",
};


// Helpers
function randomElement<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }
function randomPrice(base:number, variance:number=0.2): number { const factor = 1+(Math.random()*variance*2-variance); return Math.round(base*factor); }
function generateDescription(name:string, brand:string, condition:string, color:string) { 
  return `${condition} ${name} by ${brand}. Color: ${color}. Original product, fast shipping.`; 
}

// Main
async function main() {
  console.log('🌱 Starting seeding...');
  await prisma.ad.deleteMany();
  await prisma.user.deleteMany({ where: { id: { in: [MALL_USER_ID, ...nepaliNames.map((_,i)=>`user-${i}`)] } } });

  // Create mall user
  await prisma.user.create({ data: { id:MALL_USER_ID, name:'HaatBazaar Mall', email:'system@haatbazaar.com', avatar:'https://ui-avatars.com/api/?name=HB&background=0071dc&color=fff&size=128' } });

  // Create users
  const userIds:string[] = [];
  for (let i=0;i<nepaliNames.length;i++){
    const id=`user-${i}`;
    await prisma.user.create({ data:{ id, name: nepaliNames[i], email: nepaliNames[i].toLowerCase().replace(' ','')+'@mail.com', avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(nepaliNames[i])}&background=random&size=128` } });
    userIds.push(id);
  }

  // Generate mall products
  const allProducts:any[] = [];
  const locationKeys = Object.keys(locations);
  for (const [name,url] of Object.entries(PRODUCT_IMAGES)) {
    const color=randomElement(colorVariants);
    const loc=randomElement(locationKeys);
    const locData=locations[loc as keyof typeof locations];
    allProducts.push({
      title: name,
      price: randomPrice(1000,0.5),
      category:'mixed',
      description: generateDescription(name, 'Brand', 'Brand New', color),
      contact:'mall@haatbazaar.com',
      images:[url],
      location:{lat:locData.lat,lng:locData.lng},
      userId:MALL_USER_ID
    });
  }

  // Generate user products
  for (const [name,url] of Object.entries(USER_PRODUCT_IMAGES)){
    const color=randomElement(colorVariants);
    const loc=randomElement(locationKeys);
    const locData=locations[loc as keyof typeof locations];
    const userId=randomElement(userIds);
    allProducts.push({
      title:`${name} - User Edition`,
      price: randomPrice(800,0.5),
      category:'mixed',
      description: generateDescription(name, 'Brand', randomElement(conditions), color),
      contact:`98${Math.floor(10000000+Math.random()*90000000)}`,
      images:[url],
      location:{lat:locData.lat,lng:locData.lng},
      userId
    });
  }

  // Insert all
  for (const p of allProducts){ await prisma.ad.create({data:p}); }
  console.log(`🎉 Seeding complete! Total: ${allProducts.length}`);
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());
