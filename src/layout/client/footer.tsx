const Footer = () => {
    return (
        <footer className="w-full bg-gradient-to-r from-dark-800 to-dark-900 text-white py-12">
            <div className="max-w-[1200px] m-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-gradient">TableBook.Me</h3>
                        <p className="text-gray-300 mb-4">Your premium table booking solution for the best dining experiences.</p>
                        <div className="flex space-x-4">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors cursor-pointer">
                                📧
                            </div>
                            <div className="w-10 h-10 bg-secondary-600 rounded-full flex items-center justify-center hover:bg-secondary-700 transition-colors cursor-pointer">
                                📱
                            </div>
                            <div className="w-10 h-10 bg-accent-600 rounded-full flex items-center justify-center hover:bg-accent-700 transition-colors cursor-pointer">
                                💬
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">Find Restaurants</li>
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">How It Works</li>
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">About Us</li>
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">Contact</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">Help Center</li>
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">Privacy Policy</li>
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">Terms of Service</li>
                            <li className="hover:text-primary-400 transition-colors cursor-pointer">FAQ</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-gray-400 mb-4 md:mb-0">
                        © 2024 TableBook.Me. All rights reserved.
                    </div>
                    <div className="text-gray-400">
                        Made with ❤️ for food lovers
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;