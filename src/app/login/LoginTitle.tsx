"use client";

import { Image } from "@chakra-ui/next-js";
import { Box, HStack, Text } from "@chakra-ui/react";

export const LoginTitle = () => (
  <HStack>
    <Box rounded={100} overflow="hidden">
      <Image src="/logo.png" alt="ALYF LOGO" width={45} height={45} />
    </Box>
    <Text fontSize="xx-large" fontWeight="600" color="#f9fafb">
      ALYF
    </Text>
  </HStack>
);
