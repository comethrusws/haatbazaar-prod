# Haatbazaar - Managed Marketplace

Haatbazaar is a premium "Managed Marketplace" application where users can buy and sell items with ease. The platform bridges the gap between buyers and sellers by handling payments and delivery logistics.

![Haatbazaar](public/logo.png)

## Be a Seller, Be a Buyer
*   **Sellers**: List your unused items, wait for them to be sold, and withdraw vyour earnings directly to your bank/wallet.
*   **Buyers**: Browse a wide range of verified listings, add to cart, and checkout securely using our integrated payment gateway (IME/Khalti).

## Key Features

### Managed Marketplace
*   **Secure Payments**: Buyers pay Haatbazaar directly. We hold the funds until the order is processed.
*   **Seller Wallet**: Sellers track earnings in real-time and request withdrawals instantly.
*   **Orders & Delivery**: Full order tracking from "Pending" to "Delivered".

### Real-time Communication
*   **Chat with Seller**: instantly message sellers to negotiate or ask details.
*   **Inbox**: Manage all your conversations in one place.

### Reputation System
*   **User Reviews**: Rate and review sellers to build trust within the community.
*   **Public Profiles**: View seller stats, join date, and active listings.
*   **Advanced Earth Search**: Filter by category, price, and location.
*   **Responsive**: Optimized for Mobile, Tablet, and Desktop.

## Tech Stack
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
*   **Database**: PostgreSQL (via [Neon](https://neon.tech/)) + [Prisma ORM](https://www.prisma.io/)
*   **Authentication**: [Clerk](https://clerk.com/) (Google SSO, Email/Password)
*   **Image Storage**: [Cloudinary](https://cloudinary.com/)
*   **Emails**: [Resend](https://resend.com/) (Order confirmations, Payouts)
*   **Styling**: Tailwind CSS + FontAwesome

## Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL Database
*   Clerk Account
*   Cloudinary Account
*   Resend API Key

### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/your-username/haatbazaar-prod.git
    cd haatbazaar-prod
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    npm install --legacy-peer-deps # if react-leaflet issues occur
    ```

3.  **Environment Setup**
    Create `.env` file:
    ```env
    DATABASE_URL="postgresql://..."
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_KEY=...
    CLOUDINARY_SECRET=...
    RESEND_API_KEY=re_...
    ```

4.  **Database Migration**
    ```bash
    npx prisma db push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Project Structure
*   `src/app/actions`: Server Actions for business logic (Ad, Chat, Order, Review).
*   `src/components`: Reusable UI components (PaymentModal, CartDrawer, StarRating).
*   `src/libs`: Database connection (`db.ts`) and helpers.
*   `prisma/schema.prisma`: Database Schema definition.

## License
MIT
