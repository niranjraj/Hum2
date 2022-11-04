import { useSession, signOut } from "next-auth/react";

import profilePic from "../public/default.jpg";
import React, { useState } from "react";
import Link from "next/link";

const SideNav = () => {
  const { data: session, status } = useSession();
  const [menu, setMenu] = useState(false);
  return (
    <div className="side-nav-wrapper">
      <div className="side-nav-header">
        <div className="side-nav-img">
          {session?.user?.image ? (
            <div
              style={{
                backgroundImage: `url(${session?.user?.image})`,
              }}
              className="side-nav-profile"
            ></div>
          ) : (
            <div
              style={{
                backgroundImage: `url(${profilePic})`,
              }}
              className="side-nav-profile"
            ></div>
          )}
        </div>
        <div className="side-nav-name">{session?.user?.name}</div>
      </div>
      <div className={`side-nav-item-wrapper ${menu ? "open-menu" : ""}`}>
        <ul className="side-nav-items">
          <li>
            {session && session.user.role == "admin" ? (
              <Link href="/admin">Orders</Link>
            ) : (
              <Link href="/account">Orders</Link>
            )}
          </li>
          <li>
            {session && session.user.role == "admin" ? (
              <Link href="/admin/track">Track</Link>
            ) : (
              <Link href="/account/track">Track</Link>
            )}
          </li>
          <li>
            <button className="side-nav-logout" onClick={() => signOut()}>
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div
        className={`side-nav-hamburger ${menu ? "open-menu" : ""}`}
        onClick={() => setMenu((prev) => !prev)}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SideNav;
