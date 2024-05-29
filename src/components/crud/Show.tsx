import {
  Box,
  HStack,
  Heading,
  IconButton,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import type { ShowProps } from "@refinedev/chakra-ui";
import {
  Breadcrumb,
  DeleteButton,
  DeleteButtonProps,
  EditButton,
  EditButtonProps,
  ListButton,
  ListButtonProps,
  RefreshButton,
  RefreshButtonProps,
} from "@refinedev/chakra-ui";
import {
  useBack,
  useGo,
  useNavigation,
  useRefineContext,
  useResource,
  useRouterType,
  useToPath,
  useTranslate,
  useUserFriendlyName,
} from "@refinedev/core";
import React from "react";

// We use @tabler/icons for icons but you can use any icon library you want.
import { IconArrowLeft } from "@tabler/icons-react";

export const Show: React.FC<ShowProps> = (props) => {
  const {
    children,
    resource: resourceFromProps,
    recordItemId,
    canDelete,
    canEdit,
    dataProviderName,
    isLoading,
    footerButtons: footerButtonsFromProps,
    footerButtonProps,
    headerButtons: headerButtonsFromProps,
    headerButtonProps,
    wrapperProps,
    contentProps,
    headerProps,
    goBack: goBackFromProps,
    breadcrumb: breadcrumbFromProps,
    title,
  } = props;
  const translate = useTranslate();
  const { options: { breadcrumb: globalBreadcrumb } = {} } = useRefineContext();

  const routerType = useRouterType();
  const back = useBack();
  const go = useGo();
  const { goBack, list: legacyGoList } = useNavigation();
  const getUserFriendlyName = useUserFriendlyName();
  const { colorMode } = useColorMode();

  const {
    resource,
    action,
    id: idFromParams,
    identifier,
  } = useResource(resourceFromProps);

  const goListPath = useToPath({
    resource,
    action: "list",
  });

  const id = recordItemId ?? idFromParams;

  const breadcrumb =
    typeof breadcrumbFromProps === "undefined"
      ? globalBreadcrumb
      : breadcrumbFromProps;

  const hasList = resource?.list && !recordItemId;
  const isDeleteButtonVisible =
    canDelete ?? resource?.meta?.canDelete ?? resource?.canDelete;
  const isEditButtonVisible = canEdit ?? resource?.canEdit ?? !!resource?.edit;

  const listButtonProps: ListButtonProps | undefined = hasList
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === "legacy" ? resource?.route : identifier,
      }
    : undefined;
  const editButtonProps: EditButtonProps | undefined = isEditButtonVisible
    ? {
        colorScheme: "brand",
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === "legacy" ? resource?.route : identifier,
        recordItemId: id,
      }
    : undefined;
  const deleteButtonProps: DeleteButtonProps | undefined = isDeleteButtonVisible
    ? {
        ...(isLoading ? { disabled: true } : {}),
        resource: routerType === "legacy" ? resource?.route : identifier,
        recordItemId: id,
        onSuccess: () => {
          if (routerType === "legacy") {
            legacyGoList(resource?.route ?? resource?.name ?? "");
          } else {
            go({ to: goListPath });
          }
        },
        dataProviderName,
      }
    : undefined;
  const refreshButtonProps: RefreshButtonProps = {
    ...(isLoading ? { disabled: true } : {}),
    resource: routerType === "legacy" ? resource?.route : identifier,
    recordItemId: id,
    dataProviderName,
  };

  const defaultHeaderButtons = (
    <>
      {listButtonProps && <ListButton {...listButtonProps} />}
      {isEditButtonVisible && (
        <EditButton colorScheme="brand" {...editButtonProps} />
      )}
      {isDeleteButtonVisible && <DeleteButton {...deleteButtonProps} />}
      <RefreshButton {...refreshButtonProps} />
    </>
  );

  const buttonBack =
    goBackFromProps === (false || null) ? null : (
      <IconButton
        aria-label="back"
        rounded={0}
        variant="ghost"
        size="sm"
        onClick={
          action !== "list" && typeof action !== "undefined"
            ? routerType === "legacy"
              ? goBack
              : back
            : undefined
        }
      >
        {typeof goBackFromProps !== "undefined" ? (
          goBackFromProps
        ) : (
          <IconArrowLeft />
        )}
      </IconButton>
    );

  const headerButtons = headerButtonsFromProps
    ? typeof headerButtonsFromProps === "function"
      ? headerButtonsFromProps({
          defaultButtons: defaultHeaderButtons,
          deleteButtonProps,
          editButtonProps,
          listButtonProps,
          refreshButtonProps,
        })
      : headerButtonsFromProps
    : defaultHeaderButtons;

  const footerButtons = footerButtonsFromProps
    ? typeof footerButtonsFromProps === "function"
      ? footerButtonsFromProps({ defaultButtons: null })
      : footerButtonsFromProps
    : null;

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

    return (
      <Heading
        as="h3"
        size="lg"
        // className={RefinePageHeaderClassNames.Title}
      >
        {translate(
          `${identifier}.titles.show`,
          `Show ${getUserFriendlyName(
            resource?.meta?.label ??
              resource?.options?.label ??
              resource?.label ??
              identifier,
            "singular"
          )}`
        )}
      </Heading>
    );
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
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap="3"
        pos="sticky"
        top="4rem"
        bgColor={colorMode === "light" ? "#f1f5f9" : "#0f172a"}
        boxShadow={
          colorMode === "light"
            ? "-1px 0 #f1f5f9, 2px 0 #f1f5f9"
            : "-1px 0 #0f172a, 2px 0 #0f172a"
        }
        zIndex={1}
        {...headerProps}
      >
        <Box>
          {typeof breadcrumb !== "undefined" ? (
            <>{breadcrumb}</> ?? undefined
          ) : (
            <Breadcrumb />
          )}
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
      <Box
        opacity={isLoading ? 0.5 : undefined}
        pointerEvents={isLoading ? "none" : "auto"}
        {...contentProps}
      >
        {children}
      </Box>
      <Box
        display="flex"
        justifyContent="flex-end"
        gap="2"
        mt={8}
        {...footerButtonProps}
      >
        {footerButtons}
      </Box>
    </Box>
  );
};
