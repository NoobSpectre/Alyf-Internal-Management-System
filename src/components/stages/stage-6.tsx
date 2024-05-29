"use client";

import { FileUplaodModal, LeaveSubmitButton } from "@/components/ui";
import { supabaseClient } from "@/lib/supabase-client";
import { TProject, TStageProps } from "@/types";
import { saveAndLeave } from "@/utils/db";
import {
  Box,
  Button,
  Link as ChakraLink,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useGo } from "@refinedev/core";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";

const bucket_name = process.env.REACT_APP_STORAGE_BUCKET || "AlyfStorage";

const onBeforeRequest = async (req: any) => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  req.setHeader("Authorization", `Bearer ${session?.access_token}`);
};

export const Stage6 = ({
  id,
  isPhone,
  isProjectDataLoading,
  projectData,
  resource,
}: TStageProps) => {
  const [uppy] = useState(() =>
    new Uppy({
      id: "uppy-dashboard-brochure",
      restrictions: {
        allowedFileTypes: ["application/pdf"],
        maxNumberOfFiles: 1,
      },
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

  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);
  const [saveAndLeaveLoading, setSaveAndLeaveLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const refreshPage = () => setRefresh(pv => !pv);

  const go = useGo();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    const localStoragePdf = localStorage.getItem("uploaded_pdf");
    if (localStoragePdf === null) {
      if (projectData?.brochure_url) {
        localStorage.setItem("uploaded_pdf", projectData.brochure_url);
        setUploadedPdf(projectData.brochure_url);
      }
    } else {
      if (localStoragePdf === "undefined") return;

      const uploaded_pdf = localStoragePdf;
      setUploadedPdf(uploaded_pdf);
    }
  }, [projectData, refresh]);

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

    uppy.getFiles().forEach(file => {
      uppy.setFileMeta(file.id, {
        objectName: `${id}/brochure/brochure.pdf`,
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

    const objectNames = successful.map(_file => {
      return `${
        process.env.REACT_APP_DB_URL as string
      }/storage/v1/object/public/${bucket_name}/${
        _file.meta.objectName as string
      }`;
    });

    const uploaded_pdf = objectNames[0];

    localStorage.setItem("uploaded_pdf", uploaded_pdf);
    refreshPage();

    toast({
      title: "Success",
      description: "PDF uploaded successfully!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    uppy.cancelAll();
    onClose();
  };

  const onSave: MouseEventHandler<HTMLButtonElement> = async event => {
    event.preventDefault();

    if (!projectData) return;
    setSaveAndLeaveLoading(true);

    const data_to_upload: Pick<TProject, "brochure_url" | "stages_completed"> =
      {
        brochure_url: uploadedPdf,
        stages_completed:
          projectData.stages_completed < 6 ? 6 : projectData.stages_completed,
      };

    saveAndLeave(
      data_to_upload,
      go,
      toast,
      {
        from: resource,
        columnToMatch: "project_id",
        valueToMatchBy: id,
      },
      "uploaded_pdf"
    );

    setSaveAndLeaveLoading(false);
  };

  const removeBrochure = async () => {
    if (!uploadedPdf) return;

    const _filepath = uploadedPdf.split(bucket_name + "/")[1]; // AlyfStorage/
    // https://xufbrckkiskrczvobafr.supabase.co/storage/v1/object/public/AlyfStorage/af672bfe-3656-4855-9628-8d568f6a7746/brochure/brochure.pdf

    try {
      const { error } = await supabaseClient.storage
        .from(bucket_name)
        .remove([_filepath]);

      if (error) throw new Error(error.message);

      localStorage.removeItem("uploaded_pdf");
      setUploadedPdf(null);

      toast({
        title: "Success",
        description: `Removed brochure!`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      if (typeof error === "string")
        toast({
          title: "Error!",
          description: error,
          status: "success",
          duration: 10000,
          isClosable: true,
        });
      else
        toast({
          title: "Error!",
          description: "An unexpected error occured!",
          status: "success",
          duration: 10000,
          isClosable: true,
        });

      console.log(error);
    }
  };

  return (
    <form id="stage-6-form" noValidate>
      <Grid mb={2} gap={2}>
        {/* block title */}
        <Flex
          as={GridItem}
          position="relative"
          justifyContent="space-between"
          alignItems="end"
        >
          <Heading
            as="h3"
            fontSize="1.2rem"
            h="fit-content"
            position="sticky"
            top="4.15rem"
            fontWeight="500"
          >
            Upload Brochure
          </Heading>
          <Button
            size="sm"
            sx={{ display: "flex", px: isPhone ? 1.5 : 3, gap: 1.5 }}
            onClick={onOpen}
          >
            <IconUpload size="1.3rem" />
            {!isPhone && <Text>Upload</Text>}
          </Button>
        </Flex>

        <Divider as={GridItem} border="1px solid" />

        <GridItem>
          {uploadedPdf ? (
            <Flex
              flexDirection={isPhone ? "column" : "row"}
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <Button size="sm">
                <ChakraLink
                  as={Link}
                  href={uploadedPdf}
                  target="_blank"
                  _hover={{ textDecoration: "none" }}
                >
                  View PDF
                </ChakraLink>
              </Button>
              <Button
                leftIcon={<IconTrash size="1rem" />}
                size="sm"
                colorScheme="red"
                onClick={removeBrochure}
              >
                Remove
              </Button>
            </Flex>
          ) : (
            <Heading
              as="h6"
              fontSize="2rem"
              fontWeight="normal"
              textAlign="center"
            >
              Upload a brochure...
            </Heading>
          )}
        </GridItem>
      </Grid>

      <FileUplaodModal
        isOpen={isOpen}
        onClose={onClose}
        uppy={uppy}
        modalHeader="Upload PDF"
        handleUpload={handleUpload}
        id="project-brochure-upload-dashboard"
        noInput
      />

      <Box display="flex" justifyContent="flex-end" gap={3}>
        <LeaveSubmitButton isLoading={saveAndLeaveLoading} onClick={onSave} />
      </Box>
    </form>
  );
};
// <Edit
//   isLoading={isProjectDataLoading}
//   wrapperProps={{
//     maxW: "768px",
//     mx: "auto",
//     px: { base: "0.8rem", md: "2.5rem" },
//   }}
//   headerProps={{ p: 2 }}
//   title={<FormTitle property={projectData?.project_name} />}
//   headerButtonProps={{ display: "none" }}
// >

// </Edit>
