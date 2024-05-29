"use client";
import { ThemedLayoutV2 } from "@refinedev/chakra-ui";
import React from "react";
import { Header } from "../header";
import { Sidebar } from "../ui";

export const ThemedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2 Header={() => <Header sticky />} Sider={() => <Sidebar />}>
      {children}
    </ThemedLayoutV2>
  );
};
