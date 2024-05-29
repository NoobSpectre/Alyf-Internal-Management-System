"use client";

import { TOption } from "@/types";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import { Select } from "chakra-react-select";
import { Dispatch, SetStateAction } from "react";

type FileUPlaodModalProps = {
  uppy: Uppy<Record<string, unknown>, Record<string, unknown>>;
  initialFileTags?: readonly TOption[];
  setInitialFileTags?: Dispatch<SetStateAction<readonly TOption[]>>;
  handleUpload: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
  fileUploadError?: string | null;
  modalHeader?: string;
  optionTags?: readonly TOption[];
  noInput?: boolean;
  id?: string;
};

export const FileUplaodModal = ({
  uppy,
  initialFileTags,
  setInitialFileTags,
  handleUpload,
  isOpen,
  onClose,
  modalHeader,
  fileUploadError,
  optionTags,
  noInput = false,
  id = "project-file-upload-dashboard",
}: FileUPlaodModalProps) => {
  const { colorMode } = useColorMode();

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent mx={2}>
        <ModalHeader>{modalHeader}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <VStack gap={5}>
            {/* initial image category while uploading */}
            {noInput === false && (
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  isMulti
                  value={initialFileTags}
                  onChange={setInitialFileTags}
                  options={optionTags}
                  closeMenuOnSelect={false}
                />
                {/* <Text fontSize="0.8rem" color="tomato">
                  {fileUploadError}
                </Text> */}
              </FormControl>
            )}
            <Flex
              w="100%"
              flexDir="column"
              gap={5}
              className="dashboard-container"
            >
              <Dashboard
                id={id}
                uppy={uppy}
                hideUploadButton
                proudlyDisplayPoweredByUppy={false}
                theme={colorMode}
                style={{ zIndex: 0 }}
              />
              <Button
                backgroundColor="#22c55e"
                _hover={{ backgroundColor: "#16a34a" }}
                onClick={handleUpload}
              >
                Upload
              </Button>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
