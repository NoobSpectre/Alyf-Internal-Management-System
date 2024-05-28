import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

type TConfirmationModalProps = {
  onClick: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
  state?: boolean;
  isCentered?: true;
};

export const ConfirmationModal = ({
  onClick,
  isOpen,
  onClose,
  state,
  isCentered,
}: TConfirmationModalProps) => {
  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={2}>
        <ModalHeader>
          <Text fontSize="1.2rem" fontWeight="400">
            Are you sure you want to {state ? "restore" : "delete"} this
            project?
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalFooter display="flex" justifyContent="center" gap={5} pt={0}>
          <Button size="sm" colorScheme="twitter" onClick={onClick}>
            Yes
          </Button>
          <Button size="sm" colorScheme="red" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
