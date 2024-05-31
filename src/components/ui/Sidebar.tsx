"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { ThemedSiderV2 } from "@refinedev/chakra-ui";

export const Sidebar = () => {
  const { userRole } = useUserRole();

  return (
    <ThemedSiderV2
      activeItemDisabled
      Title={({ collapsed }) => (
        <HStack>
          <Box w="2rem" h="2rem" rounded={50} overflow="hidden">
            <Image
              src="/logo.png"
              alt="ALYF LOGO"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>
          {!collapsed && <Text fontSize="x-large">ALYF</Text>}
        </HStack>
      )}
      render={({ items, logout }) => {
        return (
          <>
            {userRole === "PANEL_USER" ? (
              <>{items.slice(0, -1).map(item => item)}</>
            ) : (
              <>{items.map(item => item)}</>
            )}
            {logout}
          </>
        );
      }}
    />
  );
};
