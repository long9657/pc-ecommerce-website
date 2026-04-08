import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="border-b border-gray-700 py-7 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div>
            <Link to='/login'>
            <h2 className="text-white text-xl font-semibold mb-1">
              Sign Up To Our Newsletter.
            </h2>
            </Link>
            <p className="text-sm text-gray-400">
              Be the first to hear about the latest offers.
            </p>
          </div>
          <div className="flex gap-3 flex-1 max-w-lg min-w-[280px]">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 bg-transparent border border-gray-600 rounded-md px-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              {[
                "About Us", "About Zip", "Privacy Policy", "Search",
                "Terms", "Orders and Returns", "Contact Us",
                "Advanced Search", "Newsletter Subscription",
              ].map((item) => (
                <li key={item}>
                  <Link to='/' className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">PC Parts</h3>
            <ul className="space-y-2 text-sm">
              {[
                "CPUs", "Add On Cards", "Hard Drives (Internal)",
                "Graphic Cards", "Keyboards / Mice",
                "Cases / Power Supplies / Cooling",
                "RAM (Memory)", "Software", "Speakers / Headsets", "Motherboards",
              ].map((item) => (
                <li key={item}>
                  <Link to='/' className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Desktop PCs</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Custom PCs", "Servers", "MSI All-In-One PCs",
                "HP/Compaq PCs", "ASUS PCs", "Tecs PCs",
              ].map((item) => (
                <li key={item}>
                  <Link to='/' className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Laptops</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Everyday Use Notebooks", "MSI Workstation Series",
                "MSI Prestige Series", "Tablets and Pads",
                "Netbooks", "Infinity Gaming Notebooks",
              ].map((item) => (
                <li key={item}>
                  <Link to='/' className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Address</h3>
            <div className="text-sm text-gray-400 space-y-2 leading-relaxed">
              <p>Address: Km 10 Nguyen Trai, Ha Noi</p>
              <p>
                Phones:{" "}
                <a href="tel:00500584766" className="text-blue-400 hover:text-blue-300">
                  (00) 500 584 766
                </a>
              </p>
              <p>Mon-Thu: 9:00 AM - 5:30 PM</p>
              <p>Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 11:00 AM - 5:00 PM</p>
              <p>
                E-mail:{" "}
                <a href="mailto:shop@email.com" className="text-blue-400 hover:text-blue-300">
                  shop@email.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
          <span className="text-blue-400 font-bold text-base">PCStore</span>
          <span>© 2026 PCStore. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}