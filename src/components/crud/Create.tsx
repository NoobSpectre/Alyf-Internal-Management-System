import {
  Box,
  BoxProps,
  HStack,
  Heading,
  IconButton,
  Spinner,
  StackProps,
} from "@chakra-ui/react";
import {
  useBack,
  useNavigation,
  useRefineContext,
  useResource,
  useRouterType,
} from "@refinedev/core";
// import { IconArrowLeft } from "@tabler/icons";
import { ReactNode } from "react";

type CreateProps = {
  children: ReactNode;
  isLoading?: boolean;
  resource?: string;
  headerButtons?: ReactNode;
  headerButtonProps?: BoxProps;
  wrapperProps?: StackProps;
  contentProps?: BoxProps;
  headerProps?: BoxProps;
  goBack?: ReactNode;
  breadcrumb?: ReactNode;
  title: ReactNode;
};

export const Create = ({
  children,
  // saveButtonProps: saveButtonPropsFromProps,
  isLoading = false,
  resource: resourceFromProps,
  // footerButtons: footerButtonsFromProps,
  // footerButtonProps,
  headerButtons,
  headerButtonProps,
  wrapperProps,
  contentProps,
  headerProps,
  goBack: goBackFromProps,
  breadcrumb: breadcrumbFromProps,
  title,
}: CreateProps) => {
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext();

  const routerType = useRouterType();
  const back = useBack();
  const { goBack } = useNavigation();

  const { resource, action, identifier } = useResource(resourceFromProps);

  // const breadcrumb =
  //   typeof breadcrumbFromProps === "undefined"
  //     ? globalBreadcrumb
  //     : breadcrumbFromProps;

  // const saveButtonProps: SaveButtonProps = {
  //   ...(isLoading ? { disabled: true } : {}),
  //   ...saveButtonPropsFromProps,
  // };

  // const defaultFooterButtons = <SaveButton {...saveButtonProps} />;

  const buttonBack =
    goBackFromProps === (false || null) ? null : (
      <IconButton
        aria-label="back"
        rounded={0}
        variant="ghost"
        size="sm"
        onClick={
          action !== "list" || typeof action !== "undefined"
            ? routerType === "legacy"
              ? goBack
              : back
            : undefined
        }
      >
        {typeof goBackFromProps !== "undefined"
          ? goBackFromProps
          : // <IconArrowLeft />
            null}
      </IconButton>
    );

  // const footerButtons = footerButtonsFromProps
  //   ? typeof footerButtonsFromProps === 'function'
  //     ? footerButtonsFromProps({
  //         defaultButtons: defaultFooterButtons,
  //         saveButtonProps,
  //       })
  //     : footerButtonsFromProps
  //   : defaultFooterButtons;

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

  return (
    <Box
      position="relative"
      bg="chakra-body-bg"
      borderRadius="md"
      px="4"
      py="3"
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
        mb="3"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap="3"
        pos="sticky"
        top="4rem"
        bgColor="#1e293b"
        boxShadow="-1px 0 #1e293b, 1px 0 #1e293b"
        zIndex={1}
        {...headerProps}
      >
        <Box minW={200}>
          {/* {typeof breadcrumb !== 'undefined' ? (
            <>{breadcrumb}</>
          ) : (
            <Breadcrumb />
          )} */}
          <HStack>
            {buttonBack}
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
      <Box opacity={isLoading ? 0.5 : undefined} {...contentProps}>
        {children}
      </Box>
      {/* <Box
        display="flex"
        justifyContent="flex-end"
        gap="2"
        mt="8"
        {...footerButtonProps}
      >
        {footerButtons}
      </Box> */}
    </Box>
  );
};
