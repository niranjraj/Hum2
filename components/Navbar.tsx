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
