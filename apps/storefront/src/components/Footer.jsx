import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#5e503f] bg-gradient-to-b from-[#151311] via-[#100f0e] to-[#0a0908]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold tracking-[0.22em] uppercase mb-4 text-white">
              VELOCE
            </h3>
            <p className="text-sm text-[#d8d0c7] leading-relaxed">
              A global destination for exotic and luxury automobiles.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4 uppercase tracking-[0.12em]">
              Inventory
            </h4>
            <ul className="space-y-2 text-sm text-[#d8d0c7]">
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#f2f4f3] transition-colors"
                >
                  All Cars
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=supercars"
                  className="hover:text-[#f2f4f3] transition-colors"
                >
                  Supercars
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=luxury"
                  className="hover:text-[#f2f4f3] transition-colors"
                >
                  Luxury cars
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4 uppercase tracking-[0.12em]">
              Help
            </h4>
            <ul className="space-y-2 text-sm text-[#d8d0c7]">
              <li>
                <Link
                  to="/orders"
                  className="hover:text-[#f2f4f3] transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-white mb-4 uppercase tracking-[0.12em]">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-[#d8d0c7]">
              <li>contact@veloce.com</li>
              <li>24/7 Global Support</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#5e503f] mt-10 pt-6 text-center text-xs text-[#a9927d]">
          © {new Date().getFullYear()} VELOCE. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
