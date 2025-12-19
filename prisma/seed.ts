import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MALL_USER_ID = 'haatbazaar-mall';
const MAX_PRODUCTS = 100;

/* ---------------- TYPES ---------------- */

type ProductTemplate = {
    name: string;
    basePrice: number;
    brand: string;
};

type Location = {
    lat: number;
    lng: number;
    region: 'valley' | 'nepal' | 'foreign';
};

/* ---------------- USERS ---------------- */

const nepaliNames = [
    'Aarav Sharma', 'Sita Adhikari', 'Bikram Thapa', 'Anita Gurung', 'Raj Kumar Poudel',
    'Sunita Rai', 'Bishal Karki', 'Maya Tamang', 'Deepak Shrestha', 'Kabita Bhandari',
    'Suman Koirala', 'Priya Magar', 'Rohan Basnet', 'Sarita Lama', 'Nabin Chhetri',
    'Gita Pradhan', 'Ashok Dahal', 'Kamala Rijal', 'Suresh Bhattarai', 'Laxmi Neupane'
];

/* ---------------- LOCATIONS (UNCHANGED) ---------------- */

const locations: Record<string, Location> = {
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

/* ---------------- PRODUCTS ---------------- */

const productTemplates: Record<string, ProductTemplate[]> = {
    electronics: [
        { name: 'Samsung Galaxy S24 Ultra', basePrice: 180000, brand: 'Samsung' },
        { name: 'iPhone 15 Pro Max', basePrice: 220000, brand: 'Apple' },
        { name: 'MacBook Pro 14 M3', basePrice: 350000, brand: 'Apple' },
        { name: 'Sony WH-1000XM5 Headphones', basePrice: 45000, brand: 'Sony' },
        { name: 'PlayStation 5', basePrice: 85000, brand: 'Sony' },
    ],
    fashion: [
        { name: 'Nike Air Jordan 1 Retro', basePrice: 28000, brand: 'Nike' },
        { name: 'Adidas Ultraboost 23', basePrice: 24000, brand: 'Adidas' },
        { name: 'Levis 501 Original Jeans', basePrice: 8500, brand: 'Levis' },
    ],
    home: [
        { name: 'Dyson V15 Detect Vacuum', basePrice: 89000, brand: 'Dyson' },
        { name: 'IKEA MALM Bed Frame King', basePrice: 65000, brand: 'IKEA' },
    ],
    vehicles: [
        { name: 'Yamaha R15 V4', basePrice: 525000, brand: 'Yamaha' },
        { name: 'Honda Dio Scooter', basePrice: 195000, brand: 'Honda' },
    ],
    beauty: [
        { name: 'Dyson Airwrap Complete', basePrice: 75000, brand: 'Dyson' },
        { name: 'MAC Lipstick Collection', basePrice: 8000, brand: 'MAC' },
    ],
};

/* ---------------- HELPERS ---------------- */

const colors = ['Black', 'White', 'Silver', 'Blue', 'Red'];

function random<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function price(base: number): number {
    return Math.round(base * (0.9 + Math.random() * 0.2));
}

function productImage(name: string, brand: string): string {
    const q = encodeURIComponent(`${brand} ${name}`);
    return `https://images.unsplash.com/search/photos?query=${q}`;
}

/* ---------------- SEED ---------------- */

async function main() {
    console.log('Seeding marketplace');

    await prisma.ad.deleteMany();
    await prisma.user.deleteMany();

    await prisma.user.create({
        data: {
            id: MALL_USER_ID,
            email: 'system@haatbazaar.com',
            name: 'HaatBazaar Mall',
            avatar: 'https://ui-avatars.com/api/?name=HB&background=0071dc&color=fff',
        },
    });

    const userIds: string[] = [];
    for (let i = 0; i < nepaliNames.length; i++) {
        const name = nepaliNames[i];
        const id = `user-${i}`;
        await prisma.user.create({
            data: {
                id,
                email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
                name,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            },
        });
        userIds.push(id);
    }

    const flat: Array<ProductTemplate & { category: string }> = [];

    for (const [category, items] of Object.entries(productTemplates)) {
        for (const item of items) {
            flat.push({ category, ...item });
        }
    }

    flat.sort(() => Math.random() - 0.5);

    const selected = flat.slice(0, MAX_PRODUCTS);
    const seen = new Set<string>();

    for (const p of selected) {
        const key = `${p.category}:${p.name}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const locKey = random(Object.keys(locations));
        const loc = locations[locKey];

        await prisma.ad.create({
            data: {
                title: `${p.name} - ${random(colors)}`,
                price: price(p.basePrice),
                category: p.category,
                description: `Brand new ${p.brand} ${p.name}. Original product.`,
                contact: 'mall@haatbazaar.com',
                images: [productImage(p.name, p.brand)],
                location: { lat: loc.lat, lng: loc.lng },
                userId: MALL_USER_ID,
            },
        });
    }

    console.log('Seeding complete');
}

main()
    .catch(err => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
