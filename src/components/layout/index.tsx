"use client";

import { ReactNode } from "react";
// import { Breadcrumb } from "../breadcrumb";
import { Menu } from "../menu";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="layout">
      <Menu />
      <div className="content">
        {/* <Breadcrumb /> */}
        <div style={{backgroundColor: 'yellow'}}>{children}</div>
      </div>
    </div>
  );
};
