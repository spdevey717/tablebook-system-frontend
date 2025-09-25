import LinkButton from "../../../components/LinkButton";
import { SettingsIcon, CalendarIcon, CheckIcon } from "../../../components/Icons";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-[1920px] m-auto px-6 py-20">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gradient leading-tight">
            Welcome to TableBook.Me
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The easiest way to book tables at your favorite restaurants. 
            Find, reserve, and enjoy your dining experience with just a few clicks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <LinkButton href="/auth/signin" className="btn-primary text-lg px-10 py-4 flex items-center gap-2">
              <SettingsIcon size={24} />
              Login Panel
            </LinkButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up max-w-4xl mx-auto">
          <div className="card card-hover p-8 text-center group">
            <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <CalendarIcon size={64} className="text-secondary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Booking</h3>
            <p className="text-gray-600 leading-relaxed">Book your table in seconds with our simple and intuitive booking system. No phone calls needed!</p>
          </div>
          <div className="card card-hover p-8 text-center group">
            <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <CheckIcon size={64} className="text-accent-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Confirmation</h3>
            <p className="text-gray-600 leading-relaxed">Get instant confirmation and manage your bookings with ease. Receive reminders and updates automatically.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Why Choose TableBook.Me?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">500+</div>
              <div className="text-gray-600">Restaurants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">50K+</div>
              <div className="text-gray-600">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">5.0</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;