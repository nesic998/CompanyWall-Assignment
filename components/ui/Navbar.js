import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="nav-items">
      <ul>
        <li className={`${router.pathname === "/" ? "active" : ""} fs-20`}>
          <Link href="/">Home</Link>
        </li>
        <li className={`${router.pathname === "/roles" ? "active" : ""} fs-20`}>
          {" "}
          <Link href="/roles">Roles</Link>
        </li>
        <li className={`${router.pathname === "/users" ? "active" : ""} fs-20`}>
          <Link href="/users">Users</Link>
        </li>
      </ul>
    </nav>
  );
}
