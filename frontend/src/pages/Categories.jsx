import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-[#FFFDF9] min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-3">
            Shop by Category 🌸
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Explore our magical collection of miniature figures, organized just for you!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-48 animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat, idx) => (
              <Link
                to={`/shop?category=${cat.id}`}
                key={cat.id}
                className="group relative bg-white rounded-3xl p-6 border border-rose-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center gap-4 overflow-hidden"
              >
                {/* Decorative background circle */}
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-100 to-pink-50 flex items-center justify-center text-3xl shadow-inner z-10 relative group-hover:rotate-12 transition-transform duration-300">
                  {idx % 3 === 0 ? "🧸" : idx % 3 === 1 ? "🎨" : "✨"}
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 z-10 relative group-hover:text-rose-500 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-16 px-4 text-center">
            <h3 className="text-lg font-bold text-gray-700">No categories found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
