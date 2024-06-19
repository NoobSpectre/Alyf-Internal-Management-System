"use client";

// import { supabaseClient } from "@/lib/supabase-client";
import { TConfig } from "@/types";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  GridItem,
  Heading,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { uuid } from "@supabase/supabase-js/dist/module/lib/helpers";
import { IconFileUpload } from "@tabler/icons-react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { supabaseBrowserClient } from "@/utils/supabase/client";

const bucket_name = process.env.REACT_APP_STORAGE_BUCKET as string;

const PARENT_FILE_PATH =
  process.env.REACT_APP_DB_URL + "/storage/v1/object/public/" + bucket_name;

const FILE_UPLOAD_ERROR = {
  inputEmptyError: "Please enter an input value before uploading...",
};

type TConfigIconUploadProps = {
  formName: "amenities" | "features";
  fieldHeader: string;
  isPhone: boolean;
  field: string;
  placeholder: string;
  dashboardId?: string;
  fieldInputType?: "text" | "number";
  setPageLoading: Dispatch<SetStateAction<boolean>>;
};

const onBeforeRequest = async (req: any) => {
  const {
    data: { session },
  } = await supabaseBrowserClient.auth.getSession();
  req.setHeader("Authorization", `Bearer ${session?.access_token}`);
};

export const ConfigIconUpload = ({
  formName,
  fieldHeader,
  isPhone,
  field,
  placeholder,
  dashboardId = "icon-dashboard",
  fieldInputType = "text",
  setPageLoading,
}: TConfigIconUploadProps) => {
  const [uppy] = useState(() =>
    new Uppy({
      id: "uppy-dashboard-images",
      restrictions: { allowedFileTypes: ["image/*"], maxNumberOfFiles: 1 },
    }).use(Tus, {
      endpoint: process.env.REACT_APP_DB_URL + "/storage/v1/upload/resumable",
      onBeforeRequest,
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],
      headers: { "x-upsert": "true" },
      removeFingerprintOnSuccess: true,
    })
  );
  const [fileUploading, setFileUploading] = useState(false);
  const [fileDeleting, setFileDeleting] = useState(false);
  const [keepPopoverMounted, setKeepPopoverMounted] = useState(false);

  const toast = useToast();
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const inputFieldRef = useRef<HTMLInputElement>(null);

  const { control } = useFormContext<Pick<TConfig, "amenities" | "features">>();
  const { fields, append, remove } = useFieldArray({ control, name: formName });

  uppy.on("files-added", files => {
    setKeepPopoverMounted(true);

    files.forEach(
      file =>
        (file.meta = {
          ...file.meta,
          bucketName: bucket_name,
          contentType: file.type,
        })
    );
  });

  uppy.on("file-removed", () => {
    setKeepPopoverMounted(false);
    onClose();
  });

  const handleUpload = async () => {
    if (inputFieldRef.current === null) return;
    const inputValue = inputFieldRef.current.value;

    if (inputValue === "") {
      toast({
        title: "Error",
        description: "Please enter a title!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (fields.filter(f => f.value === inputValue.toLowerCase()).length !== 0) {
      toast({
        title: "Error!",
        description: `'${inputValue}' ${field} already exists!`,
        duration: 2000,
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (uppy.getFiles().length === 0) {
      toast({
        title: "Error",
        description: "Please select a file!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setPageLoading(true);
    setFileUploading(true);

    const iconName = inputValue.toLowerCase().split(" ").join("_");

    uppy.getFiles().forEach(file => {
      uppy.setFileMeta(file.id, {
        objectName: `configs/${formName}/${iconName}.${file.extension}`,
      });
    });

    const { successful, failed } = await uppy.upload();

    console.log(failed);

    if (failed.length > 0) {
      toast({
        title: "Error",
        description: failed[0].error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const recentUploads: string[] = JSON.parse(
      localStorage.getItem("recent_uploads") || "[]"
    );

    localStorage.setItem(
      "recent_uploads",
      JSON.stringify([
        ...new Set([
          ...recentUploads,
          ...successful.map(_file => _file.meta.objectName as string),
        ]),
      ])
    );

    const objectNames = successful.map(_file => ({
      id: uuid(),
      label: inputValue,
      value: inputValue.toLowerCase(),
      iconUrl: PARENT_FILE_PATH + "/" + _file.meta.objectName,
    }));

    const uploaded_icons = objectNames[0];
    append(uploaded_icons);

    uppy.cancelAll();
    setPageLoading(false);
    setFileUploading(false);
    inputFieldRef.current.value = "";
    onClose();
  };

  const handleDelete = async (index: number) => {
    setPageLoading(true);
    setFileDeleting(true);

    const fieldToRemove = fields
      .filter((_, idx) => idx === index)[0]
      .iconUrl.split(bucket_name + "/")[1];

    const recentUploads: string[] = JSON.parse(
      localStorage.getItem("recent_uploads") || "[]"
    );

    try {
      const { error } = await supabaseBrowserClient.storage
        .from(bucket_name)
        .remove([fieldToRemove]);

      if (error) {
        toast({
          title: error.name,
          status: "error",
          description: error.message,
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      localStorage.setItem(
        "recent_uploads",
        JSON.stringify(recentUploads.filter(_f => _f !== fieldToRemove))
      );
      remove(index);
    } catch (error) {
      if (typeof error === "string") {
        toast({
          title: "Error",
          description: error,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else if (error && typeof error === "object" && "message" in error) {
        toast({
          title: "Error",
          description: error.message as string,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred! Please try later...",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }

      console.log(error);
    } finally {
      setPageLoading(false);
      setFileDeleting(false);
    }
  };

  return (
    <>
      <GridItem
        as={Flex}
        position="relative"
        justifyContent="space-between"
        alignItems="end"
      >
        <Heading
          as="h3"
          size="md"
          h="fit-content"
          position="sticky"
          top="4.15rem"
          fontWeight="500"
          alignSelf="end"
        >
          <span style={{ marginRight: "0.5rem" }}>{fieldHeader}</span>
          {fileDeleting && (
            <span>
              <Spinner size="sm" />
            </span>
          )}
        </Heading>

        <Flex
          role="group"
          pointerEvents={fileUploading || fileDeleting ? "none" : "auto"}
        >
          <Input
            type={fieldInputType}
            placeholder={placeholder || "Add " + fieldHeader.slice(0, -1)}
            ref={inputFieldRef}
            size="sm"
            rounded={0}
            roundedLeft={5}
          />

          <Popover
            isOpen={isOpen || keepPopoverMounted}
            onClose={onClose}
            placement="bottom-end"
            isLazy
          >
            <PopoverTrigger>
              <Button
                size="sm"
                rounded={0}
                roundedRight={5}
                bgColor="#1da1f2"
                _active={{ bgColor: "#1681bf" }}
                _hover={{ bgColor: "#1a94da" }}
                sx={{ display: "flex", px: isPhone ? 1.5 : 3, gap: 1.5 }}
                onClick={onOpen}
              >
                <IconFileUpload fontSize="large" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <Flex w="100%" flexDir="column" gap={2}>
                  <Dashboard
                    id={dashboardId}
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
                    Upload Icon
                  </Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </GridItem>

      <GridItem as={Divider} />

      <GridItem
        as={Flex}
        flexWrap="wrap"
        gap={2}
        pointerEvents={fileUploading || fileDeleting ? "none" : "auto"}
      >
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <Tag as={Flex} borderRadius="full" size="lg" key={field.id} gap={2}>
              <Avatar size="xs" src={field.iconUrl} name={field.label} />
              <TagLabel>{field.label}</TagLabel>
              <TagCloseButton onClick={() => handleDelete(index)} />
            </Tag>
          ))
        ) : (
          <Badge
            py={1}
            px={2}
            cursor="pointer"
            colorScheme="blue"
            onClick={() => inputFieldRef.current?.focus()}
          >
            Add {field}
          </Badge>
        )}
      </GridItem>
    </>
  );
};
