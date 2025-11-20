import { categories } from '@/pages/home/HomePage'

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.key} className="hover:text-red-500 cursor-pointer">
                  {cat.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-1">
              <li className="hover:text-red-500 cursor-pointer">About Us</li>
              <li className="hover:text-red-500 cursor-pointer">Contact Us</li>
              <li className="hover:text-red-500 cursor-pointer">Disclaimer</li>
              <li className="hover:text-red-500 cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
          <div className="flex items-center space-x-2">
            {/* WhatsApp icon with link */}
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-green-500 hover:text-green-600"
            >
              {/* Using SVG WhatsApp icon from lucide-react is an option; if not available, use an img or svg */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="none"
                className="w-10 h-10"
              >
                <path d="M20.52 3.48a11.87 11.87 0 00-16.77 16.7L2 22l2.07-5.41a11.86 11.86 0 0016.44-13.1zm-8.04 13.83a5.54 5.54 0 01-2.97-1.02l-.21-.15-2.22.59.59-2.16-.14-.22a5.55 5.55 0 018.3-7.82 5.51 5.51 0 01-3.35 10.77z" />
              </svg>
            </a>
            <span className="text-white font-semibold">WhatsApp</span>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-6 text-sm">
          &copy; {new Date().getFullYear()} The Eminent News (TEN). All rights reserved.
        </p>
    </div>
  )
}

export default Footer