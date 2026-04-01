import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold tracking-widest uppercase mb-4">
              Store
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Curated ethnic wear for modern women.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  to="/products"
                  className="hover:text-gray-900 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=suits"
                  className="hover:text-gray-900 transition-colors"
                >
                  Suits
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=sets"
                  className="hover:text-gray-900 transition-colors"
                >
                  Sets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
              Help
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link
                  to="/orders"
                  className="hover:text-gray-900 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>support@store.com</li>
              <li>Mon–Sat, 10am–6pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
