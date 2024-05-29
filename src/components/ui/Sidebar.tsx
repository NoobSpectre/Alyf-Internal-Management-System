import { useUserRole } from "@/hooks/useUserRole";
import { Box, HStack, Image, Text } from "@chakra-ui/react";
// import { ThemedSiderV2 } from '@refinedev/chakra-ui';
// import { useUserRole } from 'contexts/useUserRole';
// import { Link } from 'react-router-dom';

export const Sidebar = () => {
  const { userRole } = useUserRole();

  return null;
};

{/* <ThemedSiderV2
  activeItemDisabled
  Title={({ collapsed }) => (
    <HStack as={Link} to="/" replace>
      <Box w="2rem" h="2rem" rounded={50} overflow="hidden">
        <Image
          src="/ALYF_logo.png"
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
    // console.log(items.slice(0, -1));

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
/>; */}
