"use client";

import {
  ContinueSubmitButton,
  FileUplaodModal,
  LeaveSubmitButton,
  PreviewCard,
} from "@/components/ui";
import { supabaseClient } from "@/lib/supabase-client";
import { TConfig, TOption, TStageProps, TUploadedVideo } from "@/types";
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

const NEXT_STAGE = 6;

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

export const Stage5 = ({
  id,
  resource,
  isPhone,
  isProjectDataLoading,
  projectData,
}: TStageProps) => {
  const [uppy] = useState(() =>
    new Uppy({
      id: "uppy-dashboard-videos",
      restrictions: { allowedFileTypes: ["video/*"] },
    }).use(Tus, {
      endpoint:
        (process.env.REACT_APP_DB_URL as string) +
        "/storage/v1/upload/resumable",
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

  const [uploadedFiles, setUploadedFiles] = useState<TUploadedVideo[]>([]);
  const [initialVidTags, setInitialVidTags] = useState<readonly TOption[]>([]);
  const [saveAndLeaveLoading, setSaveAndLeaveLoading] = useState(false);
  const [saveAndContinueLoading, setSaveAndContinueLoading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
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
    const localStorageVideos = localStorage.getItem("uploaded_videos");
    if (localStorageVideos === null) {
      if (projectData?.project_media?.videos) {
        localStorage.setItem(
          "uploaded_videos",
          JSON.stringify(projectData.project_media.videos)
        );
        setUploadedFiles(projectData.project_media.videos);
      }
    } else {
      if (localStorageVideos === "undefined") return;

      const uploaded_videos: TUploadedVideo[] = JSON.parse(localStorageVideos);
      setUploadedFiles(uploaded_videos);
    }
  }, [projectData, refresh]);

  const openModal = () => {
    setFileUploadError(null);
    onOpen();
  };

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
    if (initialVidTags.length === 0) {
      setFileUploadError(FILE_UPLOAD_ERROR.imageCategoryError);
      return;
    }

    if (uppy.getFiles().length === 0) {
      toast({
        title: "Error",
        description: "No videos selected!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    uppy.getFiles().forEach(file => {
      uppy.setFileMeta(file.id, {
        objectName: `${id}/videos/${file.name}`,
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

    const initTags = initialVidTags.map(initTag => initTag.value);

    const objectNames = getFormattedUrls({
      files: successful,
      uploadedFiles,
      initTags,
      filePath: PARENT_FILE_PATH,
    });

    const uploaded_videos = [...uploadedFiles, ...objectNames];

    localStorage.setItem("uploaded_videos", JSON.stringify(uploaded_videos));
    refreshPage();

    toast({
      title: "Success",
      description: "Videos are uploaded successfully!",
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
          videos: uploadedFiles,
          images: projectData?.project_media?.images,
        },
        stages_completed:
          projectData.stages_completed < 5 ? 5 : projectData.stages_completed,
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
          "uploaded_videos"
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
          "uploaded_videos"
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
  //   if (!projectData) return;
  //   setSaveAndLeaveLoading(true);

  //   const data_to_upload = {
  //     images: projectData?.project_media?.images || null,
  //     videos: uploadedFiles,
  //     stages_completed:
  //       projectData.stages_completed < 5 ? 5 : projectData.stages_completed,
  //   };

  //   uploadFilesandLeave(
  //     data_to_upload,
  //     go,
  //     toast,
  //     {
  //       from: resource,
  //       columnToMatch: 'project_id',
  //       valueToMatchBy: id,
  //     },
  //     'uploaded_videos'
  //   );

  //   setSaveAndLeaveLoading(false);
  // };

  // const onSaveandContinue: MouseEventHandler<
  //   HTMLButtonElement
  // > = async event => {
  //   event.preventDefault();

  //   if (!projectData) return;
  //   setSaveAndContinueLoading(true);

  //   const data_to_upload = {
  //     images: projectData?.project_media?.images || null,
  //     videos: uploadedFiles,
  //     stages_completed:
  //       projectData.stages_completed < 5 ? 5 : projectData.stages_completed,
  //   };

  //   uploadFilesandContinue(
  //     data_to_upload,
  //     go,
  //     toast,
  //     NEXT_STAGE,
  //     {
  //       from: resource,
  //       columnToMatch: 'project_id',
  //       valueToMatchBy: id,
  //     },
  //     'uploaded_videos'
  //   );

  //   setSaveAndContinueLoading(false);
  // };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 150, tolerance: { x: 150, y: 150 } },
    }),
    useSensor(TouchSensor)
  );

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
    <form id="stage-5-form" noValidate>
      {/* form inputs container */}
      <Grid my={5} gap={2}>
        {/* block title */}
        <Flex
          as={GridItem}
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
            Upload Videos
          </Heading>
          <Button
            size="sm"
            sx={{ display: "flex", px: isPhone ? 1.5 : 3, gap: 1.5 }}
            onClick={openModal}
          >
            <IconUpload size="1.3rem" />
            {!isPhone && <Text>Upload</Text>}
          </Button>
        </Flex>

        <Divider as={GridItem} border="1px solid" />

        {/* preview images container: dnd-kit */}
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <SimpleGrid
            as={GridItem}
            gap={5}
            my={2}
            minChildWidth={{ base: "150px", md: "180px" }}
          >
            <SortableContext items={uploadedFiles}>
              {uploadedFiles.length !== 0 ? (
                <>
                  {uploadedFiles.map((file, idx) => {
                    return (
                      <PreviewCard
                        key={file.id}
                        refreshPage={refreshPage}
                        optionTags={configsData?.data.tags}
                        index={idx + 1}
                        fileType="video"
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
          </SimpleGrid>
        </DndContext>
      </Grid>

      <FileUplaodModal
        uppy={uppy}
        handleUpload={handleUpload}
        isOpen={isOpen}
        onClose={closeModal}
        initialFileTags={initialVidTags}
        setInitialFileTags={setInitialVidTags}
        optionTags={configsData?.data.tags}
        modalHeader="Upload Videos"
        fileUploadError={fileUploadError}
        id="project-videos-upload-dashboard"
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
// <Edit
//   isLoading={isProjectDataLoading}
//   wrapperProps={{
//     maxW: "1500px",
//     mx: "auto",
//     px: { base: "0.8rem", md: "2.5rem" },
//   }}
//   headerProps={{ p: 2 }}
//   title={<FormTitle property={projectData?.project_name} />}
//   headerButtonProps={{ display: "none" }}
// >

// </Edit>
