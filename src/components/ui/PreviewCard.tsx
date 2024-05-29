"use client";

import { supabaseClient } from "@/lib/supabase-client";
import { TConfig, TOption, TUploadedFile, TUploadedVideo } from "@/types";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  useColorMode,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconCheck,
  IconGripVertical,
  IconPhotoEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Select } from "chakra-react-select";
import { CSSProperties, VideoHTMLAttributes, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const bucket_name =
  (process.env.REACT_APP_STORAGE_BUCKET as string) || "AlyfStorage";

// type TRenders = {
//   [K in keyof Filetypes]: {
//     fileType: K;
//     alt: string;
//     onClick: () => void;
//     file: Filetypes[K];
//   };
// }[keyof Filetypes];

type TRenderFileProps = {
  alt?: string;
  onClick?: () => void;
  isLoading: boolean;
  setLoading: () => void;
  style?: CSSProperties;
  attributes?: VideoHTMLAttributes<HTMLVideoElement>;
} & (
  | { fileType: "image"; file: TUploadedFile }
  | {
      fileType: "video";
      file: TUploadedVideo;
    }
);

const renderFile = ({
  fileType,
  alt,
  isLoading,
  setLoading,
  onClick,
  file,
  style,
  attributes,
}: TRenderFileProps) => {
  switch (fileType) {
    case "video":
      return (
        <video
          width="100%"
          poster={file.poster}
          onClick={onClick}
          style={{ objectFit: "cover", ...style }}
          onLoad={setLoading}
          {...attributes}
        >
          <source
            src={file.url}
            style={{
              filter: isLoading
                ? "grayscale(100%) blur(12px)"
                : "grayscale(0) blur(0)",
            }}
          />
          Sorry, your device doesn&apos;t support videos!
        </video>
      );
    case "image":
    default:
      return (
        <Image
          loading="lazy"
          src={file.url}
          alt={alt}
          width="100%"
          style={{
            objectFit: "cover",
            filter: isLoading
              ? "grayscale(100%) blur(12px)"
              : "grayscale(0) blur(0)",
            ...style,
          }}
          onLoad={setLoading}
          onClick={onClick}
        />
      );
  }
};

type TPreviewCardProps = {
  index: number;
  refreshPage: () => void;
  optionTags?: readonly TOption[];
} & (
  | { fileType: "image"; file: TUploadedFile }
  | { fileType: "video"; file: TUploadedVideo }
);

export const PreviewCard = ({
  file,
  index,
  refreshPage,
  optionTags,
  fileType,
}: TPreviewCardProps) => {
  const [cardFileLoading, setCardFileLoading] = useState(true);
  const [modalFileLoading, setModalFileLoading] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 99 : "auto",
  };

  const toast = useToast();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure(); // image modal

  const { control, reset, handleSubmit } = useForm<Pick<TConfig, "tags">>({
    defaultValues: {
      tags: optionTags?.filter(tag => file.tags.includes(tag.value)),
    },
  });

  useEffect(() => {
    reset({
      tags: optionTags?.filter(tag => file.tags.includes(tag.value)),
    });
  }, [reset, optionTags, file.tags]);

  const deleteCard = async () => {
    if (file.url.startsWith("https://storage.googleapis.com")) {
      toast({
        title: "Error!",
        description: "Image doesn't exist in supabase bucket!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const _filepath = file.url.split(bucket_name + "/")[1]; // AlyfStorage/
    // https://xufbrckkiskrczvobafr.supabase.co/storage/v1/object/public/AlyfStorage/af672bfe-3656-4855-9628-8d568f6a7746/images/image.pdf
    // https://storage.googleapis.com/sharenest/alyf_web_images/The%20Banyan%20Tree%20-%202%20BHK/Hall/media_1.jpg

    let localStorageFiles: string | null = null;

    if (fileType === "image")
      localStorageFiles = localStorage.getItem("uploaded_images");
    else if (fileType === "video")
      localStorageFiles = localStorage.getItem("uploaded_videos");

    if (localStorageFiles === null) return;

    try {
      const { error } = await supabaseClient.storage
        .from(bucket_name)
        .remove([_filepath]);

      if (error) {
        toast({
          title: error.name,
          description: error.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      const uploaded_files: TUploadedFile[] = JSON.parse(localStorageFiles);

      const new_uploaded_files = uploaded_files.filter(
        ({ id }) => id !== file.id
      );

      if (fileType === "image")
        localStorage.setItem(
          "uploaded_images",
          JSON.stringify(new_uploaded_files)
        );
      else if (fileType === "video")
        localStorage.setItem(
          "uploaded_videos",
          JSON.stringify(new_uploaded_files)
        );
      refreshPage();

      toast({
        title: "Success",
        description: `Removed ${fileType}!`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      if (typeof error === "string")
        toast({
          title: "Error!",
          description: error,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      else
        toast({
          title: "Error!",
          description: "An unexpected error occured!",
          status: "error",
          duration: 2000,
          isClosable: true,
        });

      console.log(error);
    }
  };

  const addCardTags: SubmitHandler<Pick<TConfig, "tags">> = ({
    tags: newTags,
  }) => {
    let localStorageFiles: string | null = null;

    console.log("reached!");

    if (fileType === "image")
      localStorageFiles = localStorage.getItem("uploaded_images");
    else if (fileType === "video")
      localStorageFiles = localStorage.getItem("uploaded_videos");

    if (localStorageFiles === null) return;

    const uploaded_files: TUploadedFile[] = JSON.parse(localStorageFiles);

    console.log(uploaded_files);

    const new_uploaded_files: TUploadedFile[] = uploaded_files.map(_file => {
      return {
        id: _file.id,
        url: _file.url,
        tags: _file.id === file.id ? newTags.map(tag => tag.value) : _file.tags,
      };
    });

    if (fileType === "image")
      localStorage.setItem(
        "uploaded_images",
        JSON.stringify(new_uploaded_files)
      );
    else if (fileType === "video")
      localStorage.setItem(
        "uploaded_videos",
        JSON.stringify(new_uploaded_files)
      );

    refreshPage();
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      pos="relative"
      userSelect="text"
      maxW={{ base: "150px", md: "200px" }}
    >
      <Card size="sm" sx={{ pos: "relative", h: "100%" }} role="group">
        <CardBody p={2} pb={0}>
          <Box
            w="100%"
            h="120px"
            display="flex"
            placeContent="center"
            pos="relative"
            overflow="hidden"
            rounded={3}
            cursor="pointer"
          >
            {fileType === "image"
              ? renderFile({
                  fileType,
                  alt: `project image ${index}`,
                  onClick: onOpen,
                  file,
                  isLoading: cardFileLoading,
                  setLoading: () => setCardFileLoading(false),
                  style: { cursor: "pointer" },
                })
              : fileType === "video"
              ? renderFile({
                  fileType,
                  alt: `project image ${index}`,
                  onClick: onOpen,
                  file,
                  isLoading: cardFileLoading,
                  setLoading: () => setCardFileLoading(false),
                  style: { cursor: "pointer" },
                })
              : null}
            <Box
              pos="absolute"
              inset={0}
              pointerEvents="none"
              bgImage={
                colorMode === "light"
                  ? "linear-gradient(to bottom right, rgb(265, 265, 265, 0.5), transparent)"
                  : "linear-gradient(to bottom right, rgb(0, 0, 0, 0.5), transparent)"
              }
              opacity={0}
              transition="opacity 150ms"
              _groupHover={{ opacity: 0.5 }}
            />
          </Box>
        </CardBody>

        {/* drag handle */}
        <Box
          {...attributes}
          {...listeners}
          sx={{
            touchAction: "none",
            position: "absolute",
            left: 1,
            top: 2,
            opacity: { base: 1, md: 0 },
            transition: "opacity 150ms",
            cursor: "grab",
          }}
          _groupHover={{ opacity: 0.9 }}
          _active={{ cursor: "grabbing" }}
        >
          <IconGripVertical />
        </Box>

        {/* delete card btn popover */}
        <Popover size="xs">
          {({ onClose }) => (
            <>
              <PopoverTrigger>
                <IconButton
                  aria-label="delete image"
                  size="xs"
                  position="absolute"
                  right="-1.5"
                  top="-1.5"
                  rounded="full"
                  bgColor="#fa2828"
                  opacity="0.9"
                  _hover={{ bgColor: "#fa2828", opacity: 1 }}
                  _active={{ bgColor: "#fa2828", opacity: 1 }}
                  display={{ base: "flex", md: "none" }}
                  _groupHover={{ display: "flex" }}
                >
                  <IconTrash
                    size="0.8rem"
                    color={colorMode === "light" ? "#efefef" : "#101010"}
                  />
                </IconButton>
              </PopoverTrigger>
              <PopoverContent maxW="16rem">
                <PopoverHeader py={1} textAlign="center">
                  Are you sure you want to delete?
                </PopoverHeader>
                <PopoverFooter
                  sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                >
                  <IconButton
                    aria-label="delete card"
                    size="xs"
                    colorScheme="twitter"
                    onClick={() => {
                      onClose();
                      deleteCard();
                    }}
                  >
                    <IconCheck />
                  </IconButton>
                  <IconButton
                    aria-label="don't delete card"
                    size="xs"
                    bgColor="#fa2828"
                    opacity="0.9"
                    _hover={{ bgColor: "#fa2828", opacity: 1 }}
                    _active={{ bgColor: "#fc0f1b", opacity: 1 }}
                    onClick={onClose}
                  >
                    <IconX
                      color={colorMode === "light" ? "#efefef" : "#101010"}
                    />
                  </IconButton>
                </PopoverFooter>
              </PopoverContent>
            </>
          )}
        </Popover>

        <CardFooter
          px={2}
          display="flex"
          gap={2}
          justifyContent="space-between"
          alignItems="end"
        >
          {/* view tags */}
          <Flex flexWrap="wrap" gap={1}>
            <Tag
              fontSize="0.9rem"
              bgColor={
                colorMode === "light"
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(250, 250, 250, 0.2)"
              }
            >
              {file.tags[0]}
            </Tag>
            {file.tags.length >= 2 ? (
              <Button
                size="xs"
                variant="link"
                colorScheme="whatsapp"
                fontSize="0.9rem"
                onClick={onOpen}
              >
                +{file.tags.length - 1}
              </Button>
            ) : null}
          </Flex>

          {/* add tag popover */}
          <Popover size="xs" placement="top">
            <PopoverTrigger>
              <IconButton
                size="xs"
                rounded={3}
                aria-label="add tag btn"
                colorScheme="twitter"
              >
                <IconPhotoEdit size="16px" />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader py={1}>
                <Button
                  size="xs"
                  colorScheme="messenger"
                  onClick={handleSubmit(addCardTags)}
                >
                  Save
                </Button>
              </PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      placeholder="Search..."
                      options={optionTags}
                      closeMenuOnSelect={false}
                      closeMenuOnScroll
                    />
                  )}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>

      <Badge
        pos="absolute"
        top="-2"
        left="-2"
        bgColor={
          colorMode === "light"
            ? "rgba(0, 0, 0, 0.1)"
            : "rgba(250, 250, 250, 0.2)"
        }
      >
        {index}
      </Badge>

      {/* image modal */}
      <Modal size="5xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={1}>
          <ModalHeader py={2} borderBottomWidth="1px">
            <Badge size="xl" variant="solid" colorScheme="whatsapp">
              {index}
            </Badge>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <Box
              height={{ base: "26rem", md: "30rem", "2xl": "36rem" }}
              display="flex"
              placeContent="center"
            >
              {fileType === "image"
                ? renderFile({
                    fileType,
                    file,
                    isLoading: modalFileLoading,
                    setLoading: () => setModalFileLoading(false),
                    alt: `project image ${index}`,
                    style: { objectFit: "contain" },
                  })
                : fileType === "video"
                ? renderFile({
                    fileType,
                    file,
                    isLoading: modalFileLoading,
                    setLoading: () => setModalFileLoading(false),
                    alt: `project image ${index}`,
                    style: { objectFit: "contain" },
                    attributes: {
                      autoPlay: true,
                      playsInline: true,
                      controls: true,
                      loop: true,
                    },
                  })
                : null}
            </Box>
          </ModalBody>

          <ModalFooter
            borderTopWidth="1px"
            as={Flex}
            flexWrap="wrap"
            justifyContent="start"
            gap={4}
          >
            {file.tags.map(tag => {
              return (
                <Tag
                  key={`${file.id}_${tag}`}
                  fontSize="0.9rem"
                  colorScheme="whatsapp"
                >
                  {tag}
                </Tag>
              );
            })}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
