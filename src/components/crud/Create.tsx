import { Box, BoxProps, HStack, Spinner, StackProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FormTitle } from "../ui";
import { BackButton } from "../ui/BackButton";

type CreateProps = {
  children: ReactNode;
  isLoading?: boolean;
  headerButtons?: ReactNode;
  headerButtonProps?: BoxProps;
  wrapperProps?: StackProps;
  contentProps?: BoxProps;
  headerProps?: BoxProps;
};

export const Create = ({
  children,
  isLoading = false,
  headerButtons,
  headerButtonProps,
  wrapperProps,
  contentProps,
  headerProps,
}: CreateProps) => {
  return (
    <Box
      position="relative"
      bgColor="#0f172a"
      borderRadius="md"
      px="4"
      py="1rem"
      {...wrapperProps}
    >
      {isLoading && (
        <Spinner
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}
      <Box
        // mb="3"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap="3"
        pos="sticky"
        top="0"
        bgColor="#1e293b"
        boxShadow="-1px 0 #1e293b, 1px 0 #1e293b"
        zIndex={1}
        {...headerProps}
      >
        <Box minW={200}>
          <HStack>
            <BackButton />
            <FormTitle />
          </HStack>
        </Box>
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent={{ base: "flex-start", md: "flex-end" }}
          gap="2"
          {...headerButtonProps}
        >
          {headerButtons}
        </Box>
      </Box>
      <Box opacity={isLoading ? 0.5 : undefined} {...contentProps}>
        {children}
      </Box>
    </Box>
  );
};
