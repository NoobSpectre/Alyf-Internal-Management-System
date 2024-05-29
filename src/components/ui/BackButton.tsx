"use client";

import { IconButton } from "@chakra-ui/react";
import { useParsed } from "@refinedev/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const { action, resource } = useParsed();
  const router = useRouter();

  return (
    <IconButton
      aria-label="back"
      rounded={0}
      variant="ghost"
      size="sm"
      onClick={
        typeof action !== "undefined" || action !== "list"
          ? () =>
              router.replace("/" + resource?.name + "?pageSize=10&current=1")
          : undefined
      }
    >
      <IconArrowLeft />
    </IconButton>
  );
};
