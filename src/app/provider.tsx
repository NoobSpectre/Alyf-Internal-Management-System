
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { RefineThemes } from "@refinedev/chakra-ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={RefineThemes.Blue}>{children}</ChakraProvider>;
}
