import React from "react";
import { Link } from "react-router-dom";
import {  Rss } from "lucide-react";
import logo from "../assets/logo-white.png";
import {
  FaXTwitter,
  FaTelegram,
  FaWhatsapp,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import zoho from "@/assets/zoho.png"
// import { categories } from "@/types/news";

const Footer2: React.FC = () => {
  const quickLinks = [
    { label: "Home", to: "/home" },
    { label: "About Us", to: "/" },
    // { label: "Admin Login", to: "/admin/news" },
  ];
  
  const socialLinks = [
    {
      icon: FaXTwitter,
      href: "#",
      bg: "bg-black",
    },
    {
      icon: FaTelegram,
      href: "#",
      bg: "bg-sky-500",
    },
    {
      icon: FaWhatsapp,
      href: "#",
      bg: "bg-green-500",
    },
    {
      icon: FaLinkedin,
      href: "#",
      bg: "bg-blue-700",
    },
    {
      icon: FaFacebook,
      href: "#",
      bg: "bg-blue-600",
    },
    {
      icon: FaYoutube,
      href: "#",
      bg: "bg-red-600",
    },
    {
      icon: () => <img src={zoho} alt="Zoho Mail" className="w-8 md:w-10 object-contain" />,
      href: "#",
      bg: "bg-white",
    }
  ];
  

  return (
    <div>
      <svg
        width="100%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 290"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150 hidden md:block -mt-28"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stop-color="#F78DA7"></stop>
            <stop offset="95%" stop-color="#8ED1FC"></stop>
          </linearGradient>
        </defs>
        <path
          d="M 0,400 L 0,150 C 171.46666666666664,176.93333333333334 342.9333333333333,203.86666666666665 508,199 C 673.0666666666667,194.13333333333335 831.7333333333333,157.46666666666667 986,144 C 1140.2666666666667,130.53333333333333 1290.1333333333332,140.26666666666665 1440,150 L 1440,400 L 0,400 Z"
          stroke="none"
          stroke-width="0"
          fill="#000000"
          fill-opacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
      </svg>
      <svg
        width="100%"
        height="10%"
        id="svg"
        viewBox="0 0 1440 390"
        xmlns="http://www.w3.org/2000/svg"
        className="block md:hidden transition duration-300 ease-in-out delay-150"
      >
        <path
          d="M 0,400 L 0,150 C 81.95128205128205,165.01538461538462 163.9025641025641,180.03076923076924 238,176 C 312.0974358974359,171.96923076923076 378.3410256410257,148.8923076923077 447,162 C 515.6589743589743,175.1076923076923 586.7333333333333,224.4 685,215 C 783.2666666666667,205.6 908.7256410256409,137.5076923076923 991,126 C 1073.274358974359,114.4923076923077 1112.3641025641027,159.56923076923078 1180,173 C 1247.6358974358973,186.43076923076922 1343.8179487179486,168.2153846153846 1440,150 L 1440,400 L 0,400 Z"
          stroke="none"
          stroke-width="0"
          fill="#000000"
          fill-opacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
        ></path>
      </svg>

      <footer className=" bg-black text-white relative">
        {/* ======== MAIN FOOTER CONTENT ======== */}
        <div className="mx-auto px-4 md:px-12 pb-6 md:pb-12 grid md:grid-cols-2 gap-12 md:gap-96">
          {/* ---- ABOUT SECTION ---- */}
          <div className="md:mt-8">
            <img src={logo} alt="TEN" className="h-12 mb-4" />

            <ul className="space-y-2 ml-2">
              {quickLinks.map((link) => (
                <li key={link.to} className="hover:text-[#f40607] hover:underline cursor-pointer">
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>

            <p className="mt-4 ml-2">contact@eminentnews.com</p>
          </div>

          {/* ---- CATEGORIES ---- */}
          {/* <div className="md:ml-16">
            <h3 className="font-semibold text-xl mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="hover:text-[#f40607] cursor-pointer transition"
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div> */}

          {/* ---- QUICK LINKS ---- */}
          {/* <div>
            <h3 className="font-semibold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to} className="hover:text-[#f40607] cursor-pointer">
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* ---- SOCIAL MEDIA BOX ---- */}
          <div>
            <h4 className="font-semibold text-xl md:text-2xl mb-3">
              Follow Us On
            </h4>
            <div className="border rounded-lg p-5 bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <Rss className="h-12 w-12 text-white" />
                <div>
                  <h4 className="font-semibold text-lg">Follow Us On</h4>
                  <p className="text-sm">Get Latest Update On Social Media</p>
                </div>
              </div>

              {/* ICON ROW */}
              <div className="flex flex-wrap gap-4 md:gap-3 mt-4">
                {socialLinks.map(({ icon: Icon, href, bg }, i) => (
                  <a
                    key={i}
                    href={href}
                    className={`${bg} p-1 rounded-md flex items-center justify-center`}
                  >
                    <Icon className="text-white h-8 w-8 md:h-10 md:w-10" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ======== COPYRIGHT ======== */}
        <div className="border-t border-white/90 py-4 mt-4">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Eminentnews.com — All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer2;
