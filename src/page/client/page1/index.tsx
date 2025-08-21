import LinkButton from "../../../components/LinkButton";
import { SearchIcon, LocationIcon, ClockIcon, StarIcon, PizzaIcon, SushiIcon, SteakIcon, PastaIcon, NoodlesIcon, BurgerIcon, ViewIcon, BookIcon } from "../../../components/Icons";

const Page1 = () => {
  const restaurants = [
    {
      id: 1,
      name: "Pizza Palace",
      cuisine: "Italian",
      rating: 4.5,
      priceRange: "$$",
      icon: PizzaIcon,
      description: "Authentic Italian pizza and pasta dishes",
      location: "Downtown",
      waitTime: "15-20 min"
    },
    {
      id: 2,
      name: "Sushi Bar",
      cuisine: "Japanese",
      rating: 4.8,
      priceRange: "$$$",
      icon: SushiIcon,
      description: "Fresh sushi and traditional Japanese cuisine",
      location: "Riverside",
      waitTime: "10-15 min"
    },
    {
      id: 3,
      name: "Steak House",
      cuisine: "American",
      rating: 4.3,
      priceRange: "$$$",
      icon: SteakIcon,
      description: "Premium steaks and grilled specialties",
      location: "Uptown",
      waitTime: "20-25 min"
    },
    {
      id: 4,
      name: "Italian Kitchen",
      cuisine: "Italian",
      rating: 4.6,
      priceRange: "$$",
      icon: PastaIcon,
      description: "Classic Italian dishes in a cozy atmosphere",
      location: "Midtown",
      waitTime: "12-18 min"
    },
    {
      id: 5,
      name: "Thai Spice",
      cuisine: "Thai",
      rating: 4.4,
      priceRange: "$$",
      icon: NoodlesIcon,
      description: "Authentic Thai flavors and spices",
      location: "Chinatown",
      waitTime: "8-12 min"
    },
    {
      id: 6,
      name: "Burger Joint",
      cuisine: "American",
      rating: 4.2,
      priceRange: "$",
      icon: BurgerIcon,
      description: "Gourmet burgers and comfort food",
      location: "Westside",
      waitTime: "5-10 min"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-[1200px] m-auto px-6 py-12">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gradient mb-6">Find Your Perfect Restaurant</h1>
          <p className="text-xl text-gray-600 mb-8">Discover amazing dining experiences in your area</p>
          
          <div className="card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or locations..."
                  className="w-full px-6 py-4 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <SearchIcon size={20} className="text-gray-400" />
                </div>
              </div>
              <select className="px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg bg-white">
                <option>All Cuisines</option>
                <option>Italian</option>
                <option>Japanese</option>
                <option>American</option>
                <option>Thai</option>
                <option>Mexican</option>
                <option>Indian</option>
              </select>
              <select className="px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg bg-white">
                <option>All Prices</option>
                <option>$ (Under $15)</option>
                <option>$$ ($15-$30)</option>
                <option>$$$ ($30+)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {restaurants.map((restaurant, index) => (
            <div key={restaurant.id} className="card card-hover group" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <restaurant.icon size={64} className="text-primary-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-accent-600 bg-accent-50 px-3 py-1 rounded-full">{restaurant.priceRange}</div>
                    <div className="flex items-center mt-2">
                      <StarIcon size={20} className="text-yellow-500" />
                      <span className="ml-1 text-lg font-bold text-gray-900">{restaurant.rating}</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                <p className="text-primary-600 font-semibold mb-2">{restaurant.cuisine}</p>
                <p className="text-gray-600 mb-4 leading-relaxed">{restaurant.description}</p>
                
                <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <LocationIcon size={16} />
                    {restaurant.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon size={16} />
                    {restaurant.waitTime}
                  </span>
                </div>
                
                <div className="flex gap-3">
                  <LinkButton 
                    href={`/restaurant/${restaurant.id}`}
                    className="flex-1 btn-primary text-center py-3 flex items-center justify-center gap-2"
                  >
                    <ViewIcon size={16} />
                    View Details
                  </LinkButton>
                  <LinkButton 
                    href={`/book/${restaurant.id}`}
                    className="flex-1 btn-accent text-center py-3 flex items-center justify-center gap-2"
                  >
                    <BookIcon size={16} />
                    Book Table
                  </LinkButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page1;