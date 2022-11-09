import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import profilePic from "../public/default.jpg";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [menu, setMenu] = useState(false);

  return (
    <div className="navbar-wrapper">
      <div className="navbar">
        <div className="nav-logo">
          <Image src="/humlogo.png" height="47" width="100" alt="Hum" />
        </div>
        <div className="nav-menu" onClick={() => setMenu(true)}>
          {}
          Menu
        </div>
        {menu && (
          <div className="nav-menu-modal">
            <div className="nav-menu-close" onClick={() => setMenu(false)}>
              <hr />
              <hr />
            </div>
            <ul className="nav-menu-list">
              <li>
                <Link href="/account">
                  <hr />
                  Account <hr />
                </Link>
              </li>
              <li>
                <Link href="#">
                  <hr />
                  Track <hr />
                </Link>
              </li>
              {status == "authenticated" ? (
                <li>
                  <button className="logout-btn" onClick={() => signOut()}>
                    <hr /> Logout <hr />
                  </button>
                </li>
              ) : (
                <li>
                  <Link href="/login" className="login-button">
                    <hr /> Login <hr />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
