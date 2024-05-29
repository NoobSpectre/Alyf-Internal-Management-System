import { authProvider } from "@/providers/auth-provider";
import { dataProvider } from "@/providers/data-provider";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { ReactNode, Suspense } from "react";

import "./global.css";
import { cookies } from "next/headers";
import { RefineThemes } from "@refinedev/chakra-ui";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "Refine",
  description: "Generated by create refine app",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";
  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineKbarProvider>
            <Providers>
              <Refine
                routerProvider={routerProvider}
                authProvider={authProvider}
                dataProvider={dataProvider}
                resources={[
                  {
                    name: "blog_posts",
                    list: "/blog-posts",
                    create: "/blog-posts/create",
                    edit: "/blog-posts/edit/:id",
                    show: "/blog-posts/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "projects",
                    list: "/projects",
                    // create: "/projects/create",
                    // edit: "/projects/edit/:id",
                    show: "/projects/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "RFzO6Z-1fZKgi-ISO87J",
                }}
              >
                {children}
                <RefineKbar />
              </Refine>
            </Providers>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
