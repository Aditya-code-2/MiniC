import React from "react";

const About = () => {
  return (
    <div className="bg-[#FFFDF9] min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 mb-4">
            About Us 🧸
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Welcome to MiniC, the most magical corner of the internet for tiny treasures, miniature figures, and aesthetic desk companions!
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-rose-100 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 rounded-2xl overflow-hidden bg-rose-50 h-64 shadow-inner relative">
            <img 
              src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80" 
              alt="Miniature workspace" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Our Story ✨</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              MiniC started in a small workshop with a big dream: to bring joy to people's everyday lives through beautifully crafted, tiny objects. We believe that there's a unique comfort in surrounding yourself with cute, carefully detailed miniatures.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Whether you're decorating your workspace, building a terrarium, or simply collecting things that make you smile, we curate our selection to ensure every piece brings a touch of magic to your day.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-4">🌸</div>
            <h3 className="font-bold text-gray-800 mb-2">Aesthetic First</h3>
            <p className="text-xs text-gray-400">Everything we offer is carefully selected to look beautiful on your desk or shelf.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-4">💖</div>
            <h3 className="font-bold text-gray-800 mb-2">Made with Love</h3>
            <p className="text-xs text-gray-400">We source from independent creators and craftspeople who put their heart into their work.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 text-center border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="font-bold text-gray-800 mb-2">Eco-Friendly</h3>
            <p className="text-xs text-gray-400">We use sustainable packaging because taking care of our giant world is just as important!</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default About;
