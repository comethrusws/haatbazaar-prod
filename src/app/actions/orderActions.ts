'use server';

import { prisma } from "@/libs/db";
import { currentUser } from "@clerk/nextjs/server";
import { Resend } from 'resend';

// Initialize Resend with key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

type CartItem = {
    id: string; // Ad ID
    price: number;
    title: string;
    // ...other properties
};

export async function createOrder(items: CartItem[], total: number) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    // 1. Verify items are still ACTIVE
    // In a real app, strict locking/transaction needed.
    // For now, we assume check passed.

    // 2. Create Order
    const order = await prisma.order.create({
        data: {
            total,
            items: items, // Json
            status: 'PAID',
            buyerId: user.id,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
    });

    // Mall User ID - products from this user have unlimited stock
    const MALL_USER_ID = 'haatbazaar-mall';

    // 3. Process each item - Mark user listings as SOLD, credit sellers
    for (const item of items) {
        // Fetch the ad to check ownership
        const ad = await prisma.ad.findUnique({
            where: { id: item.id },
            select: { userId: true, title: true }
        });

        if (!ad) continue;

        // Only mark as SOLD if it's a user listing (not Mall product)
        // Mall products have unlimited inventory
        if (ad.userId !== MALL_USER_ID) {
            await prisma.ad.update({
                where: { id: item.id },
                data: { status: 'SOLD' }
            });
        }

        // Credit Seller (both Mall and users get credited)
        await prisma.user.update({
            where: { id: ad.userId },
            data: {
                balance: { increment: item.price }
            }
        });
    }

    // 4. Send Email to Buyer
    const deliveryDate = order.estimatedDelivery.toLocaleDateString();

    // We strictly use the user's primary email.
    const userEmail = user.emailAddresses[0].emailAddress;

    try {
        await resend.emails.send({
            from: 'Haatbazaar <onboarding@resend.dev>', // Use verified domain or default test domain
            to: [userEmail],
            subject: 'Order Confirmed - Haatbazaar',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0071dc;">Order Confirmed!</h1>
                    <p>Hi ${user.firstName || 'there'},</p>
                    <p>Thank you for your purchase. Your payment of <strong>NPR ${total.toLocaleString()}</strong> has been received.</p>
                    
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3>Order Summary</h3>
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Estimated Delivery:</strong> ${deliveryDate}</p>
                        <hr style="border: 0; border-top: 1px solid #ddd;" />
                        <ul>
                            ${items.map(item => `<li>${item.title} - NPR ${item.price.toLocaleString()}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p>We will notify you when your items are shipped.</p>
                    <p>Happy Shopping,<br/>The Haatbazaar Team</p>
                </div>
            `
        });
    } catch (e) {
        console.error("Failed to send email:", e);
        // Do not fail the transaction just because email failed?
        // Usually logical to log it but return success.
    }

    return order;
}

export async function withdrawFunds() {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser || dbUser.balance <= 0) {
        throw new Error("Insufficient balance");
    }

    const amount = dbUser.balance;

    // Reset balance
    await prisma.user.update({
        where: { id: user.id },
        data: { balance: 0 }
    });

    // Send Email
    const userEmail = user.emailAddresses[0].emailAddress;

    try {
        await resend.emails.send({
            from: 'Haatbazaar <onboarding@resend.dev>',
            to: [userEmail],
            subject: 'Payout Processed',
            html: `
                 <h1>Payout Processed</h1>
                 <p>We have processed your payout of <strong>NPR ${amount.toLocaleString()}</strong>.</p>
                 <p>Funds should appear in your account shortly.</p>
             `
        });
    } catch (e) { console.error(e); }

    return { success: true, amount };
}
