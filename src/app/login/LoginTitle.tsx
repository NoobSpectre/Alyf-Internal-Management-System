"use client";

import { Image } from "@chakra-ui/next-js";
import { Box, HStack, Text } from "@chakra-ui/react";

export const LoginTitle = () => (
  <HStack>
    <Box w="2rem" h="2rem" rounded={50} overflow="hidden">
      <Image src="/ALYF_logo.png" alt="ALYF LOGO" w="100%" h="100%" />
    </Box>
    <Text fontSize="x-large">ALYF</Text>
  </HStack>
);
