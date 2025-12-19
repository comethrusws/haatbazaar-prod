import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold">Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/" className="text-blue-600 hover:underline">
                Return Home
            </Link>
        </div>
    );
}
