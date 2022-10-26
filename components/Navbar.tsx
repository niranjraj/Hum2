import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import profilePic from "../public/default.jpg";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menu, setMenu] = useState(false);

  const menuRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      menuRef &&
      buttonRef &&
      !buttonRef.current?.contains(e.target as HTMLElement) &&
      !menuRef.current?.contains(e.target as HTMLElement)
    ) {
      setMenu(false);
    }
  };

  useEffect(() => {
    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menu]);

  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <div className="nav-logo">
          <Image src="/humlogo.png" height="47" width="100" alt="Hum" />
        </div>
        <ul className={`nav-item-wrapper `}>
          <li>
            <Link href="https://humservices.in/">Home</Link>
          </li>
          <li>
            <Link href="https://humservices.in/about-us/">About</Link>
          </li>
          <li className="service-item">
            <div className="service-item-text">
              Services
              <svg
                className="ast-arrow-svg"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                x="0px"
                y="0px"
                width="10px"
                height="10px"
                viewBox="57 35.171 26 16.043"
                enableBackground="new 57 35.171 26 16.043"
              >
                <path d="M57.5,38.193l12.5,12.5l12.5-12.5l-2.5-2.5l-10,10l-10-10L57.5,38.193z"></path>
              </svg>
            </div>

            <ul className="sub-menu">
              <li>
                <Link href="https://humservices.in/home-services/">
                  Home Services
                </Link>
              </li>
              <li>
                <Link href="https://humservices.in/delivery-services/">
                  Delivery Services
                </Link>
              </li>
              <li>
                <Link href="https://humservices.in/deepcleaning/">
                  Deep Cleaning
                </Link>
              </li>
              <li>
                <Link href="https://humservices.in/lifeart/">Life Art</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link href="https://humservices.in/contact/">Contact</Link>
          </li>
          {status === "unauthenticated" && (
            <li className="hidden-login">
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
        <div className="nav-login">
          {status === "unauthenticated" && (
            <Link href="/login" className="login-button">
              Login
            </Link>
          )}
          {status === "authenticated" && session && (
            <div
              style={{
                backgroundImage: `url(${
                  session.user?.image ? session.user?.image : profilePic
                })`,
              }}
              className="profile-icon"
              ref={buttonRef}
              onClick={() => setMenu((prev) => !prev)}
            >
              {menu && (
                <ul className="user-panel" ref={menuRef}>
                  <li>
                    <Link href="/account">Account</Link>
                  </li>
                  <li>
                    <Link href="#">Delivery Services</Link>
                  </li>
                  <li>
                    <button className="logout-btn" onClick={() => signOut()}>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        {/* <div
          className={`side-nav-hamburger ${sideMenu ? "open-menu" : ""}`}
          onClick={() => setSideMenu((prev) => !prev)}
        >
          <div></div>
          <div></div>
          <div></div>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
