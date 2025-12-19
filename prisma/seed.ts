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

// Conditions and color variants
const conditions = ['Brand New','Like New','Excellent','Good','Used'];
const colorVariants = ['Black','White','Silver','Gold','Blue','Red','Green','Space Gray','Midnight','Starlight'];

// Mall product images (stable Unsplash URLs)
const PRODUCT_IMAGES: Record<string,string> = {
  "Samsung Galaxy S24 Ultra": "https://images.unsplash.com/photo-1680488851007-197feb27e318?ixlib=rb-4.0.3&w=1080&q=80",
  "iPhone 15 Pro Max": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&w=1080&q=80",
  "MacBook Pro 14 M3": "https://images.unsplash.com/photo-1612831455543-19db5a8cb1bb?ixlib=rb-4.0.3&w=1080&q=80",
  "Sony WH-1000XM5 Headphones": "https://images.unsplash.com/photo-1585415430788-2a4b1d81646e?ixlib=rb-4.0.3&w=1080&q=80",
  "PlayStation 5": "https://images.unsplash.com/photo-1606813906675-1c22d02ab8bb?ixlib=rb-4.0.3&w=1080&q=80",
  "Xbox Series X": "https://images.unsplash.com/photo-1601041397690-b4c89cd7b30f?ixlib=rb-4.0.3&w=1080&q=80",
  "Canon EOS R6 Mark II": "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&w=1080&q=80",
  "Nike Air Jordan 1 Retro": "https://images.unsplash.com/photo-1514315192841-9219403e0168?ixlib=rb-4.0.3&w=1080&q=80",
  "Adidas Ultraboost 23": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&w=1080&q=80",
  "Levis 501 Original Jeans": "https://images.unsplash.com/photo-1556909190-b8f44fd1be2f?ixlib=rb-4.0.3&w=1080&q=80",
  "Ray Ban Aviator Sunglasses": "https://images.unsplash.com/photo-1568304065095-820f77b4b06c?ixlib=rb-4.0.3&w=1080&q=80",
  "Dyson V15 Detect Vacuum": "https://images.unsplash.com/photo-1584466977777-f8a4380f6779?ixlib=rb-4.0.3&w=1080&q=80",
  "IKEA MALM Bed Frame King": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&w=1080&q=80",
  "Herman Miller Aeron Chair": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&w=1080&q=80",
  "Yamaha R15 V4": "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-4.0.3&w=1080&q=80",
  "Honda Dio Scooter": "https://images.unsplash.com/photo-1571607382675-b79e516d70ec?ixlib=rb-4.0.3&w=1080&q=80",
  "Royal Enfield Classic 350": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&w=1080&q=80",
  "Dyson Airwrap Complete": "https://images.unsplash.com/photo-1593032465176-c3ce7970c0d3?ixlib=rb-4.0.3&w=1080&q=80",
  "MAC Lipstick Collection": "https://images.unsplash.com/photo-1593032465176-c3ce7970c0d3?ixlib=rb-4.0.3&w=1080&q=80",
  "Fenty Beauty Foundation": "https://images.unsplash.com/photo-1556228724-4e4d0c5ee7d8?ixlib=rb-4.0.3&w=1080&q=80",
  // ...add remaining to 50 mall products
};

// User product images (different)
const USER_PRODUCT_IMAGES: Record<string,string> = {
  "Samsung Galaxy S24 Ultra": "https://images.unsplash.com/photo-1581090700227-5d0ec433d7b4?ixlib=rb-4.0.3&w=1080&q=80",
  "iPhone 15 Pro Max": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&w=1080&q=80",
  "MacBook Pro 14 M3": "https://images.unsplash.com/photo-1623867342317-8b8bbde7f4ab?ixlib=rb-4.0.3&w=1080&q=80",
  "Sony WH-1000XM5 Headphones": "https://images.unsplash.com/photo-1581090700227-5d0ec433d7b4?ixlib=rb-4.0.3&w=1080&q=80",
  "PlayStation 5": "https://images.unsplash.com/photo-1616627982423-8bfa6d8b8c3f?ixlib=rb-4.0.3&w=1080&q=80",
  // ...add remaining to 50 user products
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
