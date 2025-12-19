'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADM_EMAIL = process.env.ADMIN_EMAIL || "system@haatbazaar.com";
const ADM_PASS = process.env.ADMIN_PASSWORD || "admin123";

export async function adminLogin(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email === ADM_EMAIL && password === ADM_PASS) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });
        redirect('/web/admin');
    } else {
        return { error: 'Invalid credentials' };
    }
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/web/admin/login');
}
