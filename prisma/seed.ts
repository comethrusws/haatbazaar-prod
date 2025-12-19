import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// System Mall ID - no seller info exposed
const MALL_USER_ID = 'haatbazaar-mall';

// Realistic Nepali Names for Users
const nepaliNames = [
    'Aarav Sharma', 'Sita Adhikari', 'Bikram Thapa', 'Anita Gurung', 'Raj Kumar Poudel',
    'Sunita Rai', 'Bishal Karki', 'Maya Tamang', 'Deepak Shrestha', 'Kabita Bhandari',
    'Suman Koirala', 'Priya Magar', 'Rohan Basnet', 'Sarita Lama', 'Nabin Chhetri',
    'Gita Pradhan', 'Ashok Dahal', 'Kamala Rijal', 'Suresh Bhattarai', 'Laxmi Neupane'
];

// Locations with coordinates
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
    // Foreign
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

// Product templates by category
const productTemplates = {
    electronics: [
        { name: 'Samsung Galaxy S24 Ultra', basePrice: 180000, brand: 'Samsung' },
        { name: 'iPhone 15 Pro Max', basePrice: 220000, brand: 'Apple' },
        { name: 'MacBook Pro 14" M3', basePrice: 350000, brand: 'Apple' },
        { name: 'Dell XPS 15', basePrice: 280000, brand: 'Dell' },
        { name: 'Sony WH-1000XM5 Headphones', basePrice: 45000, brand: 'Sony' },
        { name: 'AirPods Pro 2nd Gen', basePrice: 38000, brand: 'Apple' },
        { name: 'Samsung 55" QLED TV', basePrice: 120000, brand: 'Samsung' },
        { name: 'LG OLED 65" TV', basePrice: 250000, brand: 'LG' },
        { name: 'iPad Pro 12.9" M2', basePrice: 180000, brand: 'Apple' },
        { name: 'Samsung Galaxy Tab S9+', basePrice: 120000, brand: 'Samsung' },
        { name: 'PlayStation 5', basePrice: 85000, brand: 'Sony' },
        { name: 'Xbox Series X', basePrice: 80000, brand: 'Microsoft' },
        { name: 'Nintendo Switch OLED', basePrice: 55000, brand: 'Nintendo' },
        { name: 'Canon EOS R6 Mark II', basePrice: 350000, brand: 'Canon' },
        { name: 'Sony A7 IV Camera', basePrice: 320000, brand: 'Sony' },
        { name: 'DJI Mavic 3 Pro Drone', basePrice: 280000, brand: 'DJI' },
        { name: 'GoPro Hero 12 Black', basePrice: 65000, brand: 'GoPro' },
        { name: 'Bose QuietComfort Ultra', basePrice: 55000, brand: 'Bose' },
        { name: 'JBL Flip 6 Speaker', basePrice: 18000, brand: 'JBL' },
        { name: 'Samsung Galaxy Watch 6', basePrice: 45000, brand: 'Samsung' },
        { name: 'Apple Watch Ultra 2', basePrice: 135000, brand: 'Apple' },
        { name: 'Garmin Fenix 7X', basePrice: 120000, brand: 'Garmin' },
        { name: 'Dyson V15 Detect Vacuum', basePrice: 89000, brand: 'Dyson' },
        { name: 'Philips Air Fryer XXL', basePrice: 35000, brand: 'Philips' },
        { name: 'Samsung French Door Refrigerator', basePrice: 280000, brand: 'Samsung' },
    ],
    fashion: [
        { name: 'Nike Air Jordan 1 Retro', basePrice: 28000, brand: 'Nike' },
        { name: 'Adidas Ultraboost 23', basePrice: 24000, brand: 'Adidas' },
        { name: 'Levi\'s 501 Original Jeans', basePrice: 8500, brand: 'Levi\'s' },
        { name: 'Ray-Ban Aviator Classic', basePrice: 22000, brand: 'Ray-Ban' },
        { name: 'Gucci GG Marmont Bag', basePrice: 180000, brand: 'Gucci' },
        { name: 'Louis Vuitton Neverfull', basePrice: 250000, brand: 'Louis Vuitton' },
        { name: 'Rolex Submariner', basePrice: 1500000, brand: 'Rolex' },
        { name: 'Omega Seamaster', basePrice: 650000, brand: 'Omega' },
        { name: 'Canada Goose Parka', basePrice: 150000, brand: 'Canada Goose' },
        { name: 'North Face Nuptse Jacket', basePrice: 45000, brand: 'The North Face' },
        { name: 'Patagonia Fleece Pullover', basePrice: 18000, brand: 'Patagonia' },
        { name: 'Tommy Hilfiger Polo Shirt', basePrice: 8000, brand: 'Tommy Hilfiger' },
        { name: 'Calvin Klein Underwear Set', basePrice: 4500, brand: 'Calvin Klein' },
        { name: 'Zara Suit Blazer', basePrice: 15000, brand: 'Zara' },
        { name: 'H&M Cotton T-Shirt Pack', basePrice: 3500, brand: 'H&M' },
        { name: 'Uniqlo Heattech Innerwear', basePrice: 2500, brand: 'Uniqlo' },
        { name: 'Puma RS-X Sneakers', basePrice: 15000, brand: 'Puma' },
        { name: 'New Balance 990v5', basePrice: 28000, brand: 'New Balance' },
        { name: 'Converse Chuck 70', basePrice: 12000, brand: 'Converse' },
        { name: 'Vans Old Skool', basePrice: 9000, brand: 'Vans' },
    ],
    home: [
        { name: 'IKEA MALM Bed Frame King', basePrice: 65000, brand: 'IKEA' },
        { name: 'Ashley Sectional Sofa', basePrice: 120000, brand: 'Ashley' },
        { name: 'Casper Original Mattress Queen', basePrice: 85000, brand: 'Casper' },
        { name: 'Dyson Pure Cool Air Purifier', basePrice: 65000, brand: 'Dyson' },
        { name: 'Philips Hue Starter Kit', basePrice: 25000, brand: 'Philips' },
        { name: 'Nespresso Vertuo Coffee Machine', basePrice: 28000, brand: 'Nespresso' },
        { name: 'KitchenAid Stand Mixer', basePrice: 55000, brand: 'KitchenAid' },
        { name: 'Instant Pot Duo 7-in-1', basePrice: 15000, brand: 'Instant Pot' },
        { name: 'Le Creuset Dutch Oven', basePrice: 45000, brand: 'Le Creuset' },
        { name: 'Zwilling Knife Set', basePrice: 35000, brand: 'Zwilling' },
        { name: 'Tempur-Pedic Pillow', basePrice: 18000, brand: 'Tempur-Pedic' },
        { name: 'Crate & Barrel Dining Table', basePrice: 95000, brand: 'Crate & Barrel' },
        { name: 'West Elm Mid-Century Chair', basePrice: 45000, brand: 'West Elm' },
        { name: 'Herman Miller Aeron Chair', basePrice: 180000, brand: 'Herman Miller' },
        { name: 'Samsung Bespoke Refrigerator', basePrice: 320000, brand: 'Samsung' },
        { name: 'LG Front Load Washer', basePrice: 85000, brand: 'LG' },
        { name: 'Bosch Dishwasher', basePrice: 95000, brand: 'Bosch' },
        { name: 'Roomba i7+ Robot Vacuum', basePrice: 85000, brand: 'iRobot' },
        { name: 'Breville Smart Oven', basePrice: 45000, brand: 'Breville' },
        { name: 'Vitamix Professional Blender', basePrice: 75000, brand: 'Vitamix' },
    ],
    vehicles: [
        { name: 'Honda Dio 110cc Scooter', basePrice: 195000, brand: 'Honda' },
        { name: 'Yamaha R15 V4', basePrice: 525000, brand: 'Yamaha' },
        { name: 'Royal Enfield Classic 350', basePrice: 485000, brand: 'Royal Enfield' },
        { name: 'TVS Apache RTR 200', basePrice: 425000, brand: 'TVS' },
        { name: 'Bajaj Pulsar NS200', basePrice: 395000, brand: 'Bajaj' },
        { name: 'KTM Duke 390', basePrice: 785000, brand: 'KTM' },
        { name: 'Honda Activa 6G', basePrice: 175000, brand: 'Honda' },
        { name: 'Suzuki Access 125', basePrice: 165000, brand: 'Suzuki' },
        { name: 'Hero Splendor Plus', basePrice: 125000, brand: 'Hero' },
        { name: 'Honda Shine 125', basePrice: 155000, brand: 'Honda' },
    ],
    sports: [
        { name: 'Wilson Pro Staff Tennis Racket', basePrice: 35000, brand: 'Wilson' },
        { name: 'Yonex Astrox 99 Badminton', basePrice: 28000, brand: 'Yonex' },
        { name: 'Nike Mercurial Football Boots', basePrice: 22000, brand: 'Nike' },
        { name: 'Spalding NBA Basketball', basePrice: 8000, brand: 'Spalding' },
        { name: 'Callaway Rogue ST Driver', basePrice: 85000, brand: 'Callaway' },
        { name: 'Peloton Bike+', basePrice: 350000, brand: 'Peloton' },
        { name: 'NordicTrack Treadmill', basePrice: 180000, brand: 'NordicTrack' },
        { name: 'Bowflex SelectTech Dumbbells', basePrice: 55000, brand: 'Bowflex' },
        { name: 'TRX Suspension Trainer', basePrice: 25000, brand: 'TRX' },
        { name: 'Theragun Pro Massager', basePrice: 65000, brand: 'Therabody' },
    ],
    beauty: [
        { name: 'Dyson Airwrap Complete', basePrice: 75000, brand: 'Dyson' },
        { name: 'GHD Platinum+ Styler', basePrice: 45000, brand: 'GHD' },
        { name: 'La Mer Moisturizing Cream', basePrice: 55000, brand: 'La Mer' },
        { name: 'SK-II Facial Treatment Essence', basePrice: 28000, brand: 'SK-II' },
        { name: 'Charlotte Tilbury Pillow Talk Set', basePrice: 12000, brand: 'Charlotte Tilbury' },
        { name: 'MAC Lipstick Collection', basePrice: 8000, brand: 'MAC' },
        { name: 'Fenty Beauty Foundation', basePrice: 6500, brand: 'Fenty Beauty' },
        { name: 'NARS Blush Orgasm', basePrice: 5500, brand: 'NARS' },
        { name: 'Drunk Elephant Skincare Set', basePrice: 18000, brand: 'Drunk Elephant' },
        { name: 'Olaplex Hair Treatment Set', basePrice: 12000, brand: 'Olaplex' },
    ],
};

const conditions = ['Brand New', 'Like New', 'Excellent', 'Good', 'Used'];
const colorVariants = ['Black', 'White', 'Silver', 'Gold', 'Blue', 'Red', 'Green', 'Space Gray', 'Midnight', 'Starlight'];

function randomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice(base: number, variance: number = 0.2): number {
    const factor = 1 + (Math.random() * variance * 2 - variance);
    return Math.round(base * factor);
}

function generateDescription(product: any, condition: string, color: string): string {
    const templates = [
        `${condition} ${product.name} in ${color}. Genuine ${product.brand} product with original packaging.`,
        `Authentic ${product.brand} ${product.name}. ${condition} condition. ${color} variant available.`,
        `${product.name} - ${color}. ${condition}. Fast shipping available. Original warranty included.`,
        `Premium ${product.brand} quality. ${product.name} in stunning ${color}. ${condition} condition.`,
    ];
    return randomElement(templates);
}

async function main() {
    console.log('🌱 Starting large-scale database seeding...');

    // Clean existing data
    await prisma.ad.deleteMany();
    await prisma.user.deleteMany({ where: { id: { in: [MALL_USER_ID, ...nepaliNames.map((_, i) => `user-${i}`)] } } });

    // Create Mall User (hidden seller)
    await prisma.user.create({
        data: {
            id: MALL_USER_ID,
            email: 'system@haatbazaar.com',
            name: 'HaatBazaar Mall',
            avatar: 'https://ui-avatars.com/api/?name=HB&background=0071dc&color=fff&size=128',
        },
    });
    console.log('✅ Created HaatBazaar Mall system user');

    // Create Regular Users
    const userIds: string[] = [];
    for (let i = 0; i < nepaliNames.length; i++) {
        const name = nepaliNames[i];
        const userId = `user-${i}`;
        await prisma.user.create({
            data: {
                id: userId,
                email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
                name: name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`,
            },
        });
        userIds.push(userId);
    }
    console.log(`✅ Created ${userIds.length} realistic user accounts`);

    // Generate Products
    const allProducts: any[] = [];
    const locationKeys = Object.keys(locations);

    // Mall Products (200 products - no seller info conceptually)
    console.log('📦 Generating HaatBazaar Mall products...');
    for (const [category, products] of Object.entries(productTemplates)) {
        for (const product of products) {
            // Generate 3-4 variants per product
            const variants = 3 + Math.floor(Math.random() * 2);
            for (let v = 0; v < variants; v++) {
                const color = randomElement(colorVariants);
                const loc = randomElement(locationKeys);
                const locData = locations[loc as keyof typeof locations];

                allProducts.push({
                    title: `${product.name} - ${color}`,
                    price: randomPrice(product.basePrice),
                    category,
                    description: generateDescription(product, 'Brand New', color) + ' | Sold by HaatBazaar Mall - Official Store.',
                    contact: 'mall@haatbazaar.com',
                    images: [`https://loremflickr.com/600/400/${category},${product.brand.replace(/\s+/g, '')}?lock=${Math.floor(Math.random() * 99999)}`],
                    location: { lat: locData.lat, lng: locData.lng },
                    userId: MALL_USER_ID,
                });
            }
        }
    }

    // User Products (100+ products)
    console.log('👥 Generating user-listed products...');
    for (const [category, products] of Object.entries(productTemplates)) {
        for (const product of products) {
            const condition = randomElement(conditions);
            const color = randomElement(colorVariants);
            const userId = randomElement(userIds);
            const loc = randomElement(['kathmandu', 'lalitpur', 'bhaktapur', 'pokhara', 'chitwan', 'biratnagar']);
            const locData = locations[loc as keyof typeof locations];
            const priceReduction = condition === 'Brand New' ? 0.95 : condition === 'Like New' ? 0.85 : condition === 'Excellent' ? 0.75 : 0.6;

            allProducts.push({
                title: `[${condition}] ${product.name} - ${color}`,
                price: Math.round(product.basePrice * priceReduction),
                category,
                description: generateDescription(product, condition, color) + ` Contact: 98${Math.floor(10000000 + Math.random() * 90000000)}`,
                contact: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
                images: [`https://picsum.photos/seed/${Math.floor(Math.random() * 99999)}/600/400`],
                location: { lat: locData.lat, lng: locData.lng },
                userId: userId,
            });
        }
    }

    // Batch insert all products
    console.log(`📤 Inserting ${allProducts.length} products into database...`);
    for (const product of allProducts) {
        await prisma.ad.create({ data: product });
    }

    console.log(`\n🎉 Seeding complete!`);
    console.log(`   - Mall Products: ~${allProducts.filter(p => p.userId === MALL_USER_ID).length}`);
    console.log(`   - User Products: ~${allProducts.filter(p => p.userId !== MALL_USER_ID).length}`);
    console.log(`   - Total: ${allProducts.length}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
