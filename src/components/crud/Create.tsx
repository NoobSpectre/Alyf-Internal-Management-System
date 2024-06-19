import {
  Box,
  BoxProps,
  HStack,
  Heading,
  Spinner,
  StackProps,
  useColorMode,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { BackButton } from "../ui/BackButton";

type CreateProps = {
  children: ReactNode;
  isLoading?: boolean;
  headerButtons?: ReactNode;
  headerButtonProps?: BoxProps;
  wrapperProps?: StackProps;
  contentProps?: BoxProps;
  headerProps?: BoxProps;
  title?: ReactNode;
};

export const Create = ({
  children,
  isLoading = false,
  headerButtons,
  headerButtonProps,
  wrapperProps,
  contentProps,
  headerProps,
  title,
}: CreateProps) => {
  const renderTitle = () => {
    if (title === false) return null;

    if (title) {
      if (typeof title === "string" || typeof title === "number") {
        return (
          <Heading
            as="h3"
            size="lg"
            // className={RefinePageHeaderClassNames.Title}
          >
            {title}
          </Heading>
        );
      }

      return title;
    }
  };

  const { colorMode } = useColorMode();
  return (
    <Box position="relative" borderRadius="md" px="4" py="3" {...wrapperProps}>
      {isLoading && (
        <Spinner
          position="fixed"
          top="14%"
          left="55%"
          transform="translate(-50%, -50%)"
          zIndex={99}
        />
      )}
      <Box
        mb="3"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap="3"
        pos="sticky"
        top="3.9rem"
        bgColor={colorMode === "light" ? "#f8fafc" : "#1e293b"}
        zIndex={1}
        {...headerProps}
      >
        <Box minW={200}>
          <HStack>
            <BackButton />
            {renderTitle()}
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
      <Box opacity={isLoading ? 0 : 1} {...contentProps}>
        {children}
      </Box>
    </Box>
  );
};
