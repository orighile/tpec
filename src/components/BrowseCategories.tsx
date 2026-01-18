import { Link } from "react-router-dom";
import venueImage from "@/assets/categories/venue-category.jpg";
import vendorsImage from "@/assets/categories/vendors-category.jpg";
import plannersImage from "@/assets/categories/planners-category.jpg";
import ideasImage from "@/assets/categories/ideas-category.jpg";

const categories = [
  {
    title: "Browse Venues",
    image: venueImage,
    link: "/venues",
  },
  {
    title: "Browse Vendors",
    image: vendorsImage,
    link: "/vendors/marketplace",
  },
  {
    title: "Find Planners",
    image: plannersImage,
    link: "/planners",
  },
  {
    title: "Get Ideas",
    image: ideasImage,
    link: "/blog",
  },
];

const BrowseCategories = () => {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group relative h-72 overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <h3 className="text-white text-xl md:text-2xl font-bold text-center px-4 transform transition-transform duration-300 group-hover:scale-110">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseCategories;
