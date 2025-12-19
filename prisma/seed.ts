import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MALL_USER_ID = 'haatbazaar-mall';
const SAMPLE_USER_ID = 'sample-user-001';

const mallProducts = [
    {
        title: 'Samsung Galaxy S24 Ultra 256GB - Titanium Black',
        price: 189999,
        category: 'electronics',
        description: 'Brand new Samsung Galaxy S24 Ultra with S Pen. Official warranty. Titanium Black color, 256GB storage.',
        contact: 'mall@haatbazaar.com',
        images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600'],
        location: { lat: 27.7172, lng: 85.3240 },
    },
    {
        title: 'Apple MacBook Air M3 - Space Gray',
        price: 245000,
        category: 'electronics',
        description: 'Latest MacBook Air with M3 chip. 8GB RAM, 512GB SSD. Official Apple Nepal warranty.',
        contact: 'mall@haatbazaar.com',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
        location: { lat: 27.7172, lng: 85.3240 },
    },
    {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        price: 45000,
        category: 'electronics',
        description: 'Industry-leading noise cancellation. 30-hour battery. Premium sound quality.',
        contact: 'mall@haatbazaar.com',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        location: { lat: 27.7172, lng: 85.3240 },
    },
    {
        title: 'Nike Air Jordan 1 Retro High OG - Chicago',
        price: 28500,
        category: 'fashion',
        description: 'Authentic Nike Air Jordan 1 Chicago colorway. Brand new, all sizes available.',
        contact: 'mall@haatbazaar.com',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
        location: { lat: 27.7172, lng: 85.3240 },
    },
    {
        title: 'IKEA MALM Bed Frame with Storage - King Size',
        price: 65000,
        category: 'home',
        description: 'King size bed with 4 storage drawers. White finish. Easy assembly. Direct import.',
        contact: 'mall@haatbazaar.com',
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600'],
        location: { lat: 27.7172, lng: 85.3240 },
    },
    {
        title: 'Dyson V15 Detect Cordless Vacuum',
        price: 89000,
        category: 'home',
        description: 'Most powerful Dyson vacuum with laser dust detection. 60 min runtime.',
        contact: 'mall@haatbazaar.com',
        images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600'],
        location: { lat: 27.7172, lng: 85.3240 },
    },
];

const userAds = [
    {
        title: 'Used iPhone 14 Pro - Deep Purple 128GB',
        price: 120000,
        category: 'electronics',
        description: 'Slightly used iPhone 14 Pro. Battery health 92%. No scratches. Original box and charger included.',
        contact: '9841234567',
        images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600'],
        location: { lat: 27.6915, lng: 85.3420 },
    },
    {
        title: 'Honda Dio Scooter 2021 - Only 8000km',
        price: 185000,
        category: 'vehicles',
        description: 'Well maintained Honda Dio. First owner. All papers clear. Service history available.',
        contact: '9801234567',
        images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600'],
        location: { lat: 27.7000, lng: 85.3333 },
    },
    {
        title: 'Leather Sofa Set - 3+2 Seater',
        price: 45000,
        category: 'home',
        description: 'Genuine leather sofa in excellent condition. Moving out sale. Negotiable.',
        contact: '9812345678',
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
        location: { lat: 27.6800, lng: 85.3100 },
    },
    {
        title: 'PlayStation 5 with 2 Controllers',
        price: 85000,
        category: 'electronics',
        description: 'PS5 Disc Edition. Comes with 2 DualSense controllers and 3 games. No issues.',
        contact: '9867123456',
        images: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600'],
        location: { lat: 27.7100, lng: 85.3200 },
    },
];

async function main() {
    console.log('🌱 Seeding database...');

    // Create Mall User
    await prisma.user.upsert({
        where: { id: MALL_USER_ID },
        update: {},
        create: {
            id: MALL_USER_ID,
            email: 'mall@haatbazaar.com',
            name: 'HaatBazaar Mall',
            avatar: 'https://ui-avatars.com/api/?name=HB+Mall&background=0071dc&color=fff',
        },
    });

    // Create Sample User
    await prisma.user.upsert({
        where: { id: SAMPLE_USER_ID },
        update: {},
        create: {
            id: SAMPLE_USER_ID,
            email: 'user@example.com',
            name: 'Ram Sharma',
            avatar: 'https://ui-avatars.com/api/?name=Ram+Sharma&background=random',
        },
    });

    // Seed Mall Products
    for (const product of mallProducts) {
        await prisma.ad.create({
            data: {
                ...product,
                userId: MALL_USER_ID,
            },
        });
    }
    console.log(`✅ Created ${mallProducts.length} HaatBazaar Mall products`);

    // Seed User Ads
    for (const ad of userAds) {
        await prisma.ad.create({
            data: {
                ...ad,
                userId: SAMPLE_USER_ID,
            },
        });
    }
    console.log(`✅ Created ${userAds.length} user ads`);

    console.log('🎉 Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
