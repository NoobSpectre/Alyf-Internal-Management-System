"use client";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useGo, useOne, useParsed } from "@refinedev/core";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Create, Edit } from "@/components/crud";
import {
  DynamicDates,
  FormTitle,
  LeaveSubmitButton,
  ShowHeaderButtons,
  Unauthorize,
} from "@/components/ui";
// import { useUserRole } from "@/contexts/useUserRole";
import { Fragment, useEffect, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { TLocation } from "@/types";
import { saveAndLeave } from "@/utils/db";
import { getFormattedHeading, getFormattedInput } from "@/utils/fn";
import { useUserRole } from "@/hooks/useUserRole";

const RESOURCE = "locations";

const GRID_TEMPLATE_COLS = "0.6fr 5px 1fr";
const GAP_BETWEEN_LABEL_AND_INPUT = "1rem";

const LocationEdit = () => {
  const [saveAndLeaveLoading, setSaveAndLeaveLoading] = useState(false);

  const { id, resource } = useParsed();
  const [isPhone] = useMediaQuery("(max-width: 570px)");
  const go = useGo();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { userRole } = useUserRole();

  const seasonsInputRef = useRef<HTMLInputElement>(null);
  const specailDaysCalenderInputRef = useRef<HTMLInputElement>(null);

  const { data: locationData, isLoading: isLocationDataLoading } =
    useOne<TLocation>({
      resource: resource?.name || RESOURCE,
      id,
      meta: {
        idColumnName: "location_id",
      },
    });

  const formMethods = useForm<TLocation>({
    defaultValues: locationData?.data,
  });

  useEffect(() => {
    formMethods.reset(locationData?.data);
  }, [formMethods, locationData?.data]);

  const onSave: SubmitHandler<TLocation> = async (data) => {
    setSaveAndLeaveLoading(true);

    const data_to_upload: TLocation = {
      ...data,
      updated_at: new Date(Date.now()).toUTCString(),
    };

    await saveAndLeave(
      data_to_upload,
      go,
      toast,
      {
        from: resource?.name || RESOURCE,
        columnToMatch: "location_id",
        valueToMatchBy: locationData?.data.location_id,
      },
      undefined,
      { stay: true }
    );

    queryClient.invalidateQueries({ type: "all" });

    setSaveAndLeaveLoading(false);
  };

  const addFormInput = ({
    where,
    key,
  }: {
    where: "seasons" | "special_days_calender";
    key: string;
  }) => {
    if (key === "") return;

    const _v = formMethods.getValues(where);
    const formattedKey = getFormattedInput(key);

    if (_v && typeof _v === "object" && formattedKey in _v) {
      toast({
        description: "'" + key + "' already present!",
        status: "error",
        title: "Error!",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newValue = { ..._v, [formattedKey]: [] };

    formMethods.setValue(where, newValue as TLocation[typeof where]);
  };

  formMethods.watch("seasons");
  formMethods.watch("special_days_calender");

  if (userRole === "PANEL_USER") {
    return <Unauthorize />;
  }

  return (
    <Create
      isLoading={isLocationDataLoading}
      wrapperProps={{ maxW: "768px", mx: "auto" }}
      contentProps={{
        pointerEvents:
          isLocationDataLoading || saveAndLeaveLoading ? "none" : "auto",
      }}
      title={
        <FormTitle
          property={locationData?.data.display_location}
          keepEditMenu={false}
        />
      }
      headerProps={{ p: 2 }}
      headerButtonProps={{ display: "none" }}
      headerButtons={
        <ShowHeaderButtons
          resource={resource?.name || RESOURCE}
          id={locationData?.data.location_id}
          columnToMatchBy="location_id"
          deleted={locationData?.data.deleted}
          keepEditMenu={false}
        />
      }
    >
      <FormProvider {...formMethods}>
        <form id="location-edit-form" noValidate>
          {/* form inputs container */}
          <Grid my={8} gap={5}>
            {/* basic info */}
            <Grid
              as={GridItem}
              gridTemplateColumns={GRID_TEMPLATE_COLS}
              gap={2}
            >
              {/* block title */}
              <GridItem
                colSpan={isPhone ? 3 : 1}
                position="relative"
                w="fit-content"
              >
                <Heading
                  position="sticky"
                  top="7rem"
                  h="fit-content"
                  w="fit-content"
                  as="h3"
                  size="md"
                  fontWeight="500"
                >
                  Basic Information
                </Heading>
              </GridItem>

              <GridItem
                as={Divider}
                orientation={isPhone ? "horizontal" : "vertical"}
                colSpan={isPhone ? 3 : 1}
              />

              {/* block inputs */}
              <GridItem
                as={VStack}
                colSpan={isPhone ? 3 : 1}
                gap={GAP_BETWEEN_LABEL_AND_INPUT}
              >
                {/* location name */}
                <FormControl
                  isInvalid={!!formMethods.formState.errors.location_name}
                  isRequired
                >
                  <FormLabel>Location Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Location Name"
                    {...formMethods.register("location_name", {
                      required: "This field is required",
                    })}
                  />
                  <FormErrorMessage>
                    {formMethods.formState.errors.location_name?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Display Location */}
                <FormControl
                  isInvalid={!!formMethods.formState.errors.display_location}
                  isRequired
                >
                  <FormLabel>Display Location</FormLabel>
                  <Input
                    type="text"
                    placeholder="Display Location"
                    {...formMethods.register("display_location", {
                      required: "This field is required",
                    })}
                  />
                  <FormErrorMessage>
                    {formMethods.formState.errors.display_location?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* State */}
                <FormControl
                  isInvalid={!!formMethods.formState.errors.state}
                  isRequired
                >
                  <FormLabel>State</FormLabel>
                  <Input
                    type="text"
                    placeholder="State"
                    {...formMethods.register("state", {
                      required: "This field is required",
                    })}
                  />
                  <FormErrorMessage>
                    {formMethods.formState.errors.state?.message}
                  </FormErrorMessage>
                </FormControl>

                {/* Country */}
                <FormControl
                  isInvalid={!!formMethods.formState.errors.country}
                  isRequired
                >
                  <FormLabel>Country</FormLabel>
                  <Input
                    type="text"
                    placeholder="Country"
                    {...formMethods.register("country", {
                      required: "This field is required",
                    })}
                  />
                  <FormErrorMessage>
                    {formMethods.formState.errors.country?.message}
                  </FormErrorMessage>
                </FormControl>
              </GridItem>
            </Grid>

            <GridItem as={Divider} />

            {/* seasons */}
            <GridItem as={Grid} gap={2}>
              {/* left side */}
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
                  top="7rem"
                  fontWeight="500"
                  alignSelf="end"
                >
                  Seasons
                </Heading>

                {/* add column btn popover */}
                <Popover
                  initialFocusRef={seasonsInputRef}
                  placement="bottom-end"
                >
                  {({ onClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          size="sm"
                          display="flex"
                          sx={{ px: isPhone ? 1.5 : 3, gap: 1.5 }}
                          bgColor="#1da1f2"
                          _hover={{ bgColor: "#1a94da" }}
                          _active={{ bgColor: "#1681bf" }}
                        >
                          <IconPlus fontSize="large" />
                          {!isPhone && <Text>Add Season</Text>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody display="flex">
                          <Input
                            ref={seasonsInputRef}
                            rounded="4px 0 0 4px"
                            placeholder="Season Name"
                          />
                          <IconButton
                            aria-label="add season"
                            rounded="0 4px 4px 0"
                            bgColor="#22c35e"
                            _hover={{ bgColor: "#179848" }}
                            _active={{ bgColor: "#0c6c33" }}
                            onClick={() => {
                              if (seasonsInputRef.current === null) return;

                              addFormInput({
                                where: "seasons",
                                key: seasonsInputRef.current.value,
                              });

                              seasonsInputRef.current.value = "";
                              onClose();
                            }}
                          >
                            <IconCheck />
                          </IconButton>
                        </PopoverBody>
                      </PopoverContent>
                    </>
                  )}
                </Popover>
              </GridItem>

              {/* right side */}
              {Object.keys(formMethods.getValues("seasons") || {}).map(
                (season) => {
                  return (
                    <Fragment key={season}>
                      <Divider />
                      <DynamicDates
                        formName="seasons"
                        formInput={season}
                        header={getFormattedHeading(season)}
                        isPhone={isPhone}
                      />
                    </Fragment>
                  );
                }
              )}
            </GridItem>

            <GridItem as={Divider} />

            {/* special days calender */}
            <GridItem as={Grid} gap={2}>
              {/* left side */}
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
                  top="7rem"
                  fontWeight="500"
                  alignSelf="end"
                >
                  Special Days Calender
                </Heading>

                {/* add column btn popover */}
                <Popover
                  initialFocusRef={specailDaysCalenderInputRef}
                  placement="bottom-end"
                >
                  {({ onClose }) => (
                    <>
                      <PopoverTrigger>
                        <Button
                          size="sm"
                          display="flex"
                          sx={{ px: isPhone ? 1.5 : 3, gap: 1.5 }}
                          bgColor="#1da1f2"
                          _hover={{ bgColor: "#1a94da" }}
                          _active={{ bgColor: "#1681bf" }}
                        >
                          <IconPlus fontSize="large" />
                          {!isPhone && <Text>Add Year</Text>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody display="flex">
                          <Input
                            ref={specailDaysCalenderInputRef}
                            rounded="4px 0 0 4px"
                            placeholder="Add Year"
                          />
                          <IconButton
                            aria-label="add season"
                            rounded="0 4px 4px 0"
                            bgColor="#22c35e"
                            _hover={{ bgColor: "#179848" }}
                            _active={{ bgColor: "#0c6c33" }}
                            onClick={() => {
                              if (specailDaysCalenderInputRef.current === null)
                                return;

                              addFormInput({
                                where: "special_days_calender",
                                key: specailDaysCalenderInputRef.current.value,
                              });

                              specailDaysCalenderInputRef.current.value = "";
                              onClose();
                            }}
                          >
                            <IconCheck />
                          </IconButton>
                        </PopoverBody>
                      </PopoverContent>
                    </>
                  )}
                </Popover>
              </GridItem>

              {/* right side */}
              {Object.keys(
                formMethods.getValues("special_days_calender") || {}
              ).map((specialDay) => {
                return (
                  <Fragment key={specialDay}>
                    <Divider />
                    <DynamicDates
                      formName="special_days_calender"
                      formInput={specialDay}
                      header={getFormattedHeading(specialDay)}
                      isPhone={isPhone}
                    />
                  </Fragment>
                );
              })}
            </GridItem>
          </Grid>

          <Flex justifyContent="flex-end" gap={3}>
            <LeaveSubmitButton
              isLoading={saveAndLeaveLoading}
              onClick={formMethods.handleSubmit(onSave)}
            />
          </Flex>
        </form>
      </FormProvider>
    </Create>
  );
};

export default LocationEdit;
