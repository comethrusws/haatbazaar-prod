export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-600 text-sm mt-12 py-8 border-t">
            <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="font-bold mb-4 uppercase text-gray-800">Haatbazaar</h3>
                    <p>Your premium marketplace for local goods.</p>
                </div>
                <div>
                    <h3 className="font-bold mb-4 uppercase text-gray-800">Help</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline">Contact Us</a></li>
                        <li><a href="#" className="hover:underline">Help Center</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold mb-4 uppercase text-gray-800">Account</h3>
                    <ul className="space-y-2">
                        <li><a href="/sign-in" className="hover:underline">Login</a></li>
                        <li><a href="/sign-up" className="hover:underline">Register</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center mt-8 pt-8 border-t">
                &copy; {new Date().getFullYear()} Haatbazaar. All rights reserved.
            </div>
        </footer>
    );
}
