"use client";

import {
  ContinueSubmitButton,
  FileUplaodModal,
  LeaveSubmitButton,
  PreviewCard,
} from "@/components/ui";
import { supabaseClient } from "@/lib/supabase-client";
import { TConfig, TOption, TStageProps, TUploadedFile } from "@/types";
import { uploadFilesandContinue, uploadFilesandLeave } from "@/utils/db";
import { getFormattedUrls } from "@/utils/fn";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useGo, useOne } from "@refinedev/core";
import { IconUpload } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { MouseEventHandler, useEffect, useState } from "react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const NEXT_STAGE = 5;

const bucket_name = process.env.REACT_APP_STORAGE_BUCKET || "AlyfStorage";

const PARENT_FILE_PATH =
  process.env.REACT_APP_DB_URL + "/storage/v1/object/public/" + bucket_name;

const FILE_UPLOAD_ERROR = {
  imageCategoryError: "Please enter a category before uploading...",
};

const onBeforeRequest = async (req: any) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  req.setHeader("Authorization", `Bearer ${session?.access_token}`);
};

export const Stage4 = ({
  id,
  resource,
  isPhone,
  isProjectDataLoading,
  projectData,
}: TStageProps) => {
  const [uppy] = useState(() =>
    new Uppy({
      id: "uppy-dashboard-images",
      restrictions: { allowedFileTypes: ["image/*"] },
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

  const [uploadedFiles, setUploadedFiles] = useState<TUploadedFile[]>([]);
  const [initialImgTags, setInitialImgTags] = useState<readonly TOption[]>([]);
  const [saveAndLeaveLoading, setSaveAndLeaveLoading] = useState(false);
  const [saveAndContinueLoading, setSaveAndContinueLoading] = useState(false);
  const [fileUploadError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  const refreshPage = () => setRefresh(pv => !pv);

  const { isOpen, onClose, onOpen } = useDisclosure();
  const go = useGo();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: configsData } = useOne<TConfig>({
    resource: "configs",
    id: "7622f753-4406-4ac9-b770-78cd949afb0d",
  });

  useEffect(() => {
    const localStorageImages = localStorage.getItem("uploaded_images");
    if (localStorageImages === null) {
      if (projectData?.project_media?.images) {
        localStorage.setItem(
          "uploaded_images",
          JSON.stringify(projectData.project_media.images)
        );
        setUploadedFiles(projectData.project_media.images);
      }
    } else {
      if (localStorageImages === "undefined") return;

      const uploaded_images: TUploadedFile[] = JSON.parse(localStorageImages);
      setUploadedFiles(uploaded_images);
    }
  }, [projectData, refresh]);

  // const openModal = () => {
  //   setFileUploadError(null);
  //   onOpen();
  // };

  const closeModal = () => onClose();

  uppy.on("files-added", files => {
    files.forEach(
      file =>
        (file.meta = {
          ...file.meta,
          bucketName: bucket_name,
          contentType: file.type,
        })
    );
  });

  const handleUpload = async () => {
    if (initialImgTags.length === 0) {
      toast({
        title: "Error",
        description: FILE_UPLOAD_ERROR.imageCategoryError,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (uppy.getFiles().length === 0) {
      toast({
        title: "Error",
        description: "No images selected",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    uppy.getFiles().forEach(file => {
      uppy.setFileMeta(file.id, {
        objectName: `${id}/images/${file.name}`,
      });
    });

    const { successful, failed } = await uppy.upload();

    if (failed.length > 0) {
      console.log(failed);
      toast({
        title: "Error",
        description: failed[0].error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const initTags = initialImgTags.map(initTag => initTag.value);

    const objectNames = getFormattedUrls({
      files: successful,
      uploadedFiles,
      initTags,
      filePath: PARENT_FILE_PATH,
    });

    const uploaded_images = [...uploadedFiles, ...objectNames];

    localStorage.setItem("uploaded_images", JSON.stringify(uploaded_images));
    refreshPage();

    toast({
      title: "Success",
      description: "Images are uploaded successfully!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    uppy.cancelAll();
    closeModal();
  };

  const goToStageFns = (
    stageToGo?: number
  ): MouseEventHandler<HTMLButtonElement> => {
    return async event => {
      event.preventDefault();

      if (!projectData) return;
      if (stageToGo) setSaveAndContinueLoading(true);
      else setSaveAndLeaveLoading(true);

      const data_to_upload = {
        project_media: {
          images: uploadedFiles,
          videos: projectData?.project_media?.videos,
        },
        stages_completed:
          projectData.stages_completed < 4 ? 4 : projectData.stages_completed,
      };

      if (stageToGo)
        await uploadFilesandContinue(
          data_to_upload,
          go,
          toast,
          stageToGo,
          {
            from: resource,
            columnToMatch: "project_id",
            valueToMatchBy: id,
          },
          "uploaded_images"
        );
      else
        await uploadFilesandLeave(
          data_to_upload,
          go,
          toast,
          {
            from: resource,
            columnToMatch: "project_id",
            valueToMatchBy: id,
          },
          "uploaded_images"
        );

      queryClient.invalidateQueries({
        type: "all",
      });

      if (stageToGo) setSaveAndContinueLoading(false);
      else setSaveAndLeaveLoading(false);
    };
  };

  const onSave = goToStageFns();
  const onSaveandContinue = goToStageFns(NEXT_STAGE);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active) return;
    if (!over) return;
    if (active.id === over.id) return;

    const sourcePos = active.data.current?.sortable.index;
    const destinationPos = over.data.current?.sortable.index;

    const newArray = arrayMove(uploadedFiles, sourcePos, destinationPos);

    setUploadedFiles(newArray);
    localStorage.setItem("uploaded_images", JSON.stringify(newArray));
  };

  return (
    <form id="stage-4-form" noValidate>
      {/* form inputs container */}
      <Grid my={5} gap={2}>
        {/* block title */}
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
            Upload Images
          </Heading>
          <Button
            size="sm"
            sx={{ display: "flex", px: isPhone ? 1.5 : 3, gap: 1.5 }}
            onClick={onOpen}
          >
            <Icon as={IconUpload} fontSize="large" />
            {!isPhone && <Text>Upload</Text>}
          </Button>
        </GridItem>

        <GridItem as={Divider} border="1px solid" />

        {/* preview images container: dnd-kit */}
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <GridItem
            as={SimpleGrid}
            gap={5}
            my={2}
            minChildWidth={isPhone ? "150px" : "180px"}
          >
            <SortableContext items={uploadedFiles}>
              {uploadedFiles.length !== 0 ? (
                <>
                  {uploadedFiles.map((file, idx) => {
                    return (
                      <PreviewCard
                        refreshPage={refreshPage}
                        optionTags={configsData?.data.tags}
                        key={file.id}
                        index={idx + 1}
                        fileType="image"
                        file={file}
                      />
                    );
                  })}
                </>
              ) : (
                <Heading
                  as="h2"
                  fontSize="3rem"
                  fontWeight="normal"
                  textAlign="center"
                >
                  Upload Images...
                </Heading>
              )}
            </SortableContext>
          </GridItem>
        </DndContext>
      </Grid>

      <FileUplaodModal
        uppy={uppy}
        handleUpload={handleUpload}
        isOpen={isOpen}
        onClose={closeModal}
        initialFileTags={initialImgTags}
        setInitialFileTags={setInitialImgTags}
        optionTags={configsData?.data.tags}
        modalHeader="Upload Images"
        fileUploadError={fileUploadError}
        id="project-images-upload-dashboard"
      />

      <Box display="flex" justifyContent="flex-end" gap={3}>
        <LeaveSubmitButton
          isDisabled={saveAndContinueLoading}
          isLoading={saveAndLeaveLoading}
          onClick={onSave}
        />
        <ContinueSubmitButton
          isDisabled={saveAndLeaveLoading}
          isLoading={saveAndContinueLoading}
          onClick={onSaveandContinue}
        />
      </Box>
    </form>
  );
};

{
  /* <Edit
  isLoading={isProjectDataLoading}
  wrapperProps={{
    maxW: "1500px",
    mx: "auto",
    px: { base: "0.8rem", md: "2.5rem" },
  }}
  headerProps={{ p: 2 }}
  title={<FormTitle property={projectData?.project_name} />}
  headerButtonProps={{ display: "none" }}
></Edit>; */
}
