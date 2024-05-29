import { Button } from "@chakra-ui/react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { MouseEventHandler } from "react";

type TContinueButtonProps = {
  isDisabled?: boolean;
  isLoading: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export const LeaveSubmitButton = ({
  isDisabled,
  isLoading,
  onClick,
}: TContinueButtonProps) => (
  <Button
    type="submit"
    px={3}
    leftIcon={<IconDeviceFloppy size="1.3rem" />}
    isDisabled={isDisabled}
    bgColor="#0ea5e9"
    _hover={{ bgColor: "#0ea5e9" }}
    _active={{ bgColor: "#0ea5e9", transform: "scale(0.98)" }}
    _loading={{ bgColor: "#0ea5e9" }}
    isLoading={isLoading}
    loadingText="Please wait"
    onClick={onClick}
  >
    Save
  </Button>
);
