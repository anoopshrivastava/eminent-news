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
import { useLocation } from "react-router-dom";
// import { categories } from "@/types/news";

const Footer2: React.FC = () => {
  const quickLinks = [
    // { label: "Home", to: "/home" },
    { label: "About Us", to: "/" },
    { label: "Contact Us", to: "/" },
    { label: "Privacy Policy", to: "#" },
    { label: "Disclaimer", to: "#" },
    // { label: "Admin Login", to: "/admin/news" },
  ];
  
  const socialLinks = [
    {
      icon: FaXTwitter,
      href: "https://x.com/TheEminentNews",
      bg: "bg-black",
    },
    {
      icon: FaTelegram,
      href: "https://t.me/TheEminentNews",
      bg: "bg-sky-500",
    },
    {
      icon: FaWhatsapp,
      href: "https://whatsapp.com/channel/0029Vb5Eh3vC6ZvkjqBCRX25",
      bg: "bg-green-500",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/eminent-news/",
      bg: "bg-blue-700",
    },
    {
      icon: FaFacebook,
      href: "https://www.facebook.com/share/1Vruc3yr65/",
      bg: "bg-blue-600",
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com/@eminentnews?si=QzcdpYJQstk1deol",
      bg: "bg-red-600",
    },
    {
      icon: () => <img src={zoho} alt="Zoho Mail" className="w-5 md:w-6 object-contain" />,
      href: "#",
      bg: "bg-white",
    }
  ];

  const location = useLocation();
  const isHome = location.pathname === "/";

  const hideFooterRoutes = ["/shorts", "/videos"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  if (shouldHideFooter) {
    return null;
  }

  return (
    // <div>
    //   {/* <svg
    //     width="100%"
    //     height="100%"
    //     id="svg"
    //     viewBox="0 0 1440 290"
    //     xmlns="http://www.w3.org/2000/svg"
    //     className="transition duration-300 ease-in-out delay-150 hidden md:block -mt-28"
    //   >
    //     <defs>
    //       <linearGradient id="gradient" x1="0%" y1="50%" x2="100%" y2="50%">
    //         <stop offset="5%" stop-color="#F78DA7"></stop>
    //         <stop offset="95%" stop-color="#8ED1FC"></stop>
    //       </linearGradient>
    //     </defs>
    //     <path
    //       d="M 0,400 L 0,150 C 171.46666666666664,176.93333333333334 342.9333333333333,203.86666666666665 508,199 C 673.0666666666667,194.13333333333335 831.7333333333333,157.46666666666667 986,144 C 1140.2666666666667,130.53333333333333 1290.1333333333332,140.26666666666665 1440,150 L 1440,400 L 0,400 Z"
    //       stroke="none"
    //       stroke-width="0"
    //       fill="#000000"
    //       fill-opacity="1"
    //       className="transition-all duration-300 ease-in-out delay-150 path-0"
    //     ></path>
    //   </svg>
    //   <svg
    //     width="100%"
    //     height="10%"
    //     id="svg"
    //     viewBox="0 0 1440 390"
    //     xmlns="http://www.w3.org/2000/svg"
    //     className="block md:hidden transition duration-300 ease-in-out delay-150"
    //   >
    //     <path
    //       d="M 0,400 L 0,150 C 81.95128205128205,165.01538461538462 163.9025641025641,180.03076923076924 238,176 C 312.0974358974359,171.96923076923076 378.3410256410257,148.8923076923077 447,162 C 515.6589743589743,175.1076923076923 586.7333333333333,224.4 685,215 C 783.2666666666667,205.6 908.7256410256409,137.5076923076923 991,126 C 1073.274358974359,114.4923076923077 1112.3641025641027,159.56923076923078 1180,173 C 1247.6358974358973,186.43076923076922 1343.8179487179486,168.2153846153846 1440,150 L 1440,400 L 0,400 Z"
    //       stroke="none"
    //       stroke-width="0"
    //       fill="#000000"
    //       fill-opacity="1"
    //       className="transition-all duration-300 ease-in-out delay-150 path-0"
    //     ></path>
    //   </svg> */}

     
    // </div>
    <footer className="w-full bg-black text-white relative pt-5">
    {/* ======== MAIN FOOTER CONTENT ======== */}
    <div className="mx-auto px-4 md:px-12 pb-6 flex flex-col md:flex-row justify-between">
      {/* ---- ABOUT SECTION ---- */}
      <div className="md:mt-8 md:w-[75%]">

        <div className="flex items-center gap-2">
          <Link to="/home">
            <img src={logo} alt="" className="h-8 md:h-9" />
          </Link>

          <div className="flex flex-col text-white border-l-2 border-white pl-3">
            <h3 className="text-lg md:text-3xl font-bold">The Eminent News</h3>
            <h5 className="text-[10px] md:text-xs -mt-1 pl-1">Empowering Wisdom</h5>
          </div>
        </div>

        <ul className="space-y-0.5 ml-1 mt-2">
          {quickLinks.map((link) => (
            <li key={link.to} className="hover:text-[#f40607] hover:underline cursor-pointer">
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-col ml-1 mt-3">
          <span className="">contact@eminentnews.com</span>
          {/* <span className="">+91 1234567890</span> */}
        </div>
        
      </div>

      {/* ---- SOCIAL MEDIA BOX ---- */}
      <div className="md:w-[30%]">
        {/* <h4 className="font-semibold text-xl md:text-2xl mb-3">
          Follow Us On
        </h4> */}
        <div className="mb-6"></div>
        <div className="border rounded-lg p-5 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-3">
            <Rss className="h-12 w-12 text-white" />
            <div>
              <h4 className="font-semibold text-lg">Follow Us On</h4>
              <p className="text-sm">Get Latest Update On Social Media</p>
            </div>
          </div>

          {/* ICON ROW */}
          <div className="flex flex-wrap gap-3 mt-4">
            {socialLinks.map(({ icon: Icon, href, bg }, i) => (
              <a
                key={i}
                target="_blank"
                href={href}
                className={`${bg} p-1 rounded-md flex items-center justify-center`}
              >
                <Icon className="text-white h-5 w-5 md:h-6 md:w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* ======== COPYRIGHT ======== */}
    <div className={`flex flex-col border-t border-white/90 py-4 mt-4 ${!isHome ? "pb-20 md:pb-4" : ""}`}>
      <p className="text-center ">⁠Powered by Kubza Pvt Ltd</p>
      <p className="text-center text-sm">
        © {new Date().getFullYear()} Eminentnews.com — All rights reserved
      </p>
    </div>
  </footer>
  );
};

export default Footer2;
