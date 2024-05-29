import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useBack, useNavigation, useRouterType } from "@refinedev/core";
import Link from "next/link";

export const Unauthorize = () => {
  const back = useBack();
  const { goBack } = useNavigation();
  const routerType = useRouterType();

  return (
    <Flex flexDir="column" alignItems="center" gap={5}>
      <Text
        textAlign="center"
        fontSize={{ base: "2rem", sm: "3rem", lg: "4rem" }}
        fontWeight={700}
        color="ButtonShadow"
      >
        Unauthorized Access Not Permitted
      </Text>
      <HStack gap={5}>
        <Button onClick={routerType === "legacy" ? goBack : back}>
          Go back
        </Button>
        <Button as={Link} href="/" replace>
          Go home
        </Button>
      </HStack>
    </Flex>
  );
};
