"use client";

import { Button } from "@chakra-ui/button";
import { IconArrowRightBar } from "@tabler/icons-react";
import { MouseEventHandler } from "react";

type TContinueButtonProps = {
  isDisabled?: boolean;
  isLoading: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const ContinueSubmitButton = ({
  isDisabled,
  isLoading,
  onClick,
}: TContinueButtonProps) => (
  <Button
    type="submit"
    name="continue"
    rightIcon={<IconArrowRightBar size="1.3rem" />}
    isDisabled={isDisabled}
    bgColor="#22c55e"
    _hover={{ bgColor: "#22c55e" }}
    _active={{ bgColor: "#22c55e", transform: "scale(0.98)" }}
    _loading={{ bgColor: "#22c55e" }}
    isLoading={isLoading}
    loadingText="Please wait"
    onClick={onClick}
  >
    Continue
  </Button>
);
