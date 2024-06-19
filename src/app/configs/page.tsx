"use client";

import { Create } from "@/components/crud";
import { ConfigField, ConfigIconUpload, Unauthorize } from "@/components/ui";
import { useUserRole } from "@/hooks/useUserRole";
import { TConfig } from "@/types";
import { removeFromBucket, saveAndLeave } from "@/utils/db";
import { sort } from "@/utils/fn";
import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useGo, useOne } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const CONFIG_ID = "7622f753-4406-4ac9-b770-78cd949afb0d";

const ConfigCreate = () => {
  const [pageLoading, setPageLoading] = useState(false);

  const [isPhone] = useMediaQuery("(max-width: 570px)");
  const go = useGo();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { userRole } = useUserRole();

  const {
    data: configsData,
    isLoading: isConfigsDataLoading,
    isError: isConfigsError,
  } = useOne<TConfig>({ resource: "configs", id: CONFIG_ID });

  const formMethods = useForm<TConfig>({ defaultValues: configsData?.data });

  useEffect(() => {
    const resetIconUploads = async () => {
      const configRecentIconUploads = localStorage.getItem("recent_uploads");

      if (configRecentIconUploads) {
        setPageLoading(true);

        const recentUploads: string[] = JSON.parse(configRecentIconUploads);

        await removeFromBucket({
          filesToRemove: recentUploads,
          toast,
          keyToRemove: "recent_uploads",
        });

        setPageLoading(false);
      }
    };

    formMethods.reset(configsData?.data);

    resetIconUploads();
  }, [formMethods, configsData?.data, toast]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSave: SubmitHandler<TConfig> = async data => {
    setPageLoading(true);

    onClose();

    const data_to_update: TConfig = {
      ...data,
      bhk_configurations: sort(data.bhk_configurations),
    };

    await saveAndLeave(
      data_to_update,
      go,
      toast,
      {
        columnToMatch: "config_id",
        from: "configs",
        valueToMatchBy: CONFIG_ID,
      },
      "recent_uploads",
      { stay: true }
    );

    queryClient.invalidateQueries({
      type: "all",
    });

    setPageLoading(false);
  };

  if (userRole === "PANEL_USER") {
    return <Unauthorize />;
  }

  return (
    <Create
      isLoading={isConfigsDataLoading}
      wrapperProps={{ maxWidth: "768px", mx: "auto" }}
      title="Configurations"
      // headerButtonProps={{ display: "none" }}
      headerProps={{ zIndex: 5, p: '0.5rem' }}
      contentProps={{ pointerEvents: pageLoading ? "none" : "auto" }}
      
    >
      <FormProvider {...formMethods}>
        <form noValidate>
          <Grid my={8} gap={5}>
            {/* configField tags */}
            <GridItem as={Grid} gap={2}>
              <ConfigField
                fieldHeader="Tags"
                formName="tags"
                field="tag"
                isPhone={isPhone}
              />
            </GridItem>

            <GridItem as={Divider} />

            {/* amenities */}
            <GridItem as={Grid} gap={2}>
              <ConfigIconUpload
                fieldHeader="Amenities"
                field="amenity"
                formName="amenities"
                isPhone={isPhone}
                placeholder="Add Amenity Title"
                dashboardId="amenity-icon-upload-dashboard"
                setPageLoading={setPageLoading}
              />
            </GridItem>

            <GridItem as={Divider} />

            {/* features */}
            <GridItem as={Grid} gap={2}>
              <ConfigIconUpload
                fieldHeader="Features"
                field="feature"
                formName="features"
                isPhone={isPhone}
                placeholder="Add Feature Title"
                dashboardId="feature-icon-upload-dashboard"
                setPageLoading={setPageLoading}
              />
            </GridItem>

            <GridItem as={Divider} />

            {/* property_type */}
            <GridItem as={Grid} gap={2}>
              <ConfigField
                fieldHeader="Property Types"
                formName="property_types"
                field="property type"
                isPhone={isPhone}
              />
            </GridItem>

            <GridItem as={Divider} />

            {/* available buy options */}
            <GridItem as={Grid} gap={2}>
              <ConfigField
                fieldHeader="Available Buy Options"
                placeholder="Add Buy Option"
                formName="available_buy_options"
                field="available buy option"
                isPhone={isPhone}
              />
            </GridItem>

            <GridItem as={Divider} />

            {/* bhk_configuration */}
            <GridItem as={Grid} gap={2}>
              <ConfigField
                fieldHeader="BHK Configurations"
                formName="bhk_configurations"
                field="bhk configuration"
                isPhone={isPhone}
                fieldInputType="number"
              />
            </GridItem>

            <GridItem as={Divider} />

            {/* categories */}
            <GridItem as={Grid} gap={2}>
              <ConfigField
                fieldHeader="Categories"
                placeholder="Add Category"
                formName="categories"
                field="category"
                isPhone={isPhone}
              />
            </GridItem>
          </Grid>

          <Flex justifyContent="flex-end">
            <Button
              bgColor="#22c35e"
              _hover={{ bgColor: "#179848" }}
              _active={{ bgColor: "#0c6c33" }}
              _loading={{ bgColor: "#22c35e" }}
              onClick={onOpen}
              loadingText="Please wait"
            >
              Save
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalCloseButton />
                <ModalHeader py={2}>
                  <Text fontWeight="bold">
                    Are you sure you want to save this Configuration?
                  </Text>
                </ModalHeader>

                <ModalFooter gap={3} pt={0}>
                  <Button
                    type="submit"
                    size="sm"
                    colorScheme="messenger"
                    onClick={formMethods.handleSubmit(onSave)}
                  >
                    Save
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
        </form>
      </FormProvider>
    </Create>
  );
};

export default ConfigCreate;
