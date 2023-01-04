import { NavLink } from "@remix-run/react";
import React from "react";

export default function Menu({ children }) {
  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="px-4 drawer-content">
        {children}
        {/* <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
          Open drawer
        </label> */}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="p-2 menu bg-base-300 w-52 text-content text-slate">
          <li>
            <NavLink to={"/"}>Overview</NavLink>
          </li>
          <li>
            <NavLink to={"/container/actions"}>Container Actions</NavLink>
          </li>
          <li>
            <NavLink to={"/batch"}>Batches</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
