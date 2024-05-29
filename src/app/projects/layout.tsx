import { authProviderServer } from "@/providers/auth-provider";
import { Box } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import React from "react";
import { ThemedLayout } from "@/components/themed-layout";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();

  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }

  // return <BaseLayout>{children}</BaseLayout>;
  // return (
  //   <BaseLayout>
  //     <Box
  //       position="relative"
  //       bg="chakra-body-bg"
  //       borderRadius="md"
  //       px="4"
  //       py="3"
  //     >
  //       {/* {isLoading && (
  //       <Spinner
  //         position="absolute"
  //         top="50%"
  //         left="50%"
  //         transform="translate(-50%, -50%)"
  //       />
  //     )} */}
  //       <Box
  //         mb="3"
  //         display="flex"
  //         justifyContent="space-between"
  //         alignItems="center"
  //         flexWrap={{ base: "wrap", md: "nowrap" }}
  //         gap="3"
  //         pos="sticky"
  //         top="4rem"
  //         bgColor="#1e293b"
  //         boxShadow="-1px 0 #1e293b, 1px 0 #1e293b"
  //         zIndex={1}
  //       >
  //         <Box minW={200}>
  //           {/* {typeof breadcrumb !== 'undefined' ? (
  //       <>{breadcrumb}</>
  //     ) : (
  //       <Breadcrumb />
  //     )} */}
  //           <HStack>
  //             {/* TODO */}
  //             {/* {buttonBack}
  //           {renderTitle()} */}
  //           </HStack>
  //         </Box>
  //         <Box
  //           display="flex"
  //           flexWrap="wrap"
  //           justifyContent={{ base: "flex-start", md: "flex-end" }}
  //           gap="2"
  //         >
  //           {/* to create header buttons for create, edit and show */}
  //           {null}
  //         </Box>
  //       </Box>
  //       {/* <Box opacity={isLoading ? 0.5 : undefined} {...contentProps}> */}
  //       <Box>{children}</Box>
  //       {/* <Box
  //   display="flex"
  //   justifyContent="flex-end"
  //   gap="2"
  //   mt="8"
  //   {...footerButtonProps}
  // >
  //   {footerButtons}
  // </Box> */}
  //     </Box>
  //   </BaseLayout>
  // );
  return <ThemedLayout>{children}</ThemedLayout>;
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
  };
}
