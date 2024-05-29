"use client";

import { ContinueSubmitButton, LeaveSubmitButton } from "@/components/ui";
import { TConfig, TLocation, TProject, TStageProps } from "@/types";
import { saveAndContinue, saveAndLeave } from "@/utils/db";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useGo, useList, useOne } from "@refinedev/core";
import { IconSelect, IconX } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const NEXT_STAGE = 2;
const LOC_TABLE = "locations";

export const Stage1 = ({
  id,
  resource,
  colorMode,
  isPhone,
  grid_template_cols,
  gap_between_label_and_input,
  projectData,
  isProjectDataLoading,
}: TStageProps) => {
  const [saveAndLeaveLoading, setSaveAndLeaveLoading] = useState(false);
  const [saveAndContinueLoading, setSaveAndContinueLoading] = useState(false);

  const go = useGo();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    isOpen: isLocationDrawerOpen,
    onOpen: onLocationDrawerOpen,
    onClose: onLocationDrawerClose,
  } = useDisclosure(); // location drawer

  const { data: configsData } = useOne<TConfig>({
    resource: "configs",
    id: "7622f753-4406-4ac9-b770-78cd949afb0d",
  });

  const {
    data: projectLocations,
    error: projectLocationsError,
    isLoading: projectLocationsLoading,
  } = useList<TLocation>({
    resource: LOC_TABLE,
    filters: [{ field: "deleted", operator: "eq", value: false }],
    pagination: { mode: "off" },
  });

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors, isLoading: isFormLoading },
  } = useForm<TProject>({ defaultValues: projectData });

  useEffect(() => {
    reset(projectData);
  }, [reset, projectData]);

  const setLocationValue = (loc_id: string) => {
    setValue("location_id", loc_id);
  };

  const closeLocationDrawer = (loc_id: string) => {
    setLocationValue(loc_id);
    onLocationDrawerClose();
  };

  const goToStageFns = (stageToGo?: number): SubmitHandler<TProject> => {
    return async data => {
      if (!stageToGo) setSaveAndLeaveLoading(true);
      else setSaveAndContinueLoading(true);

      if (
        data["lat_long"][0]?.toString() === "" &&
        data["lat_long"][1]?.toString() !== ""
      ) {
        toast({
          title: "Error",
          description:
            "Please provide both latitude and longitude coordinates, or omit both.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });

        return;
      } else if (
        data["lat_long"][0]?.toString() !== "" &&
        data["lat_long"][1]?.toString() === ""
      ) {
        toast({
          title: "Error",
          description:
            "Please provide both latitude and longitude coordinates, or omit both.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });

        return;
      }

      let __lat_long: boolean = true;
      if (
        data["lat_long"][0]?.toString() === "" &&
        data["lat_long"][1]?.toString() === ""
      )
        __lat_long = false;

      data = {
        ...data,
        lat_long: __lat_long
          ? [Number(data["lat_long"][0]), Number(data["lat_long"][1])]
          : [],
        stages_completed:
          data["stages_completed"] < 1 ? 1 : data["stages_completed"],
      };

      if (stageToGo)
        await saveAndContinue(data, go, toast, stageToGo, {
          from: resource,
          columnToMatch: "project_id",
          valueToMatchBy: id,
        });
      else
        await saveAndLeave(data, go, toast, {
          from: resource,
          columnToMatch: "project_id",
          valueToMatchBy: id,
        });

      queryClient.invalidateQueries({
        type: "all",
      });

      if (!stageToGo) setSaveAndLeaveLoading(false);
      else setSaveAndContinueLoading(false);
    };
  };

  const onSave = goToStageFns();
  const onSaveandContinue = goToStageFns(NEXT_STAGE);

  return (
    <form id="stage-1-form" noValidate>
      {/* form inputs container */}
      <Grid my={8} gap={5}>
        {/* basic info */}
        <Grid as={GridItem} gridTemplateColumns={grid_template_cols} gap={2}>
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

          <GridItem colSpan={isPhone ? 3 : 1}>
            <Divider orientation={isPhone ? "horizontal" : "vertical"} />
          </GridItem>

          {/* block inputs */}
          <VStack
            as={GridItem}
            colSpan={isPhone ? 3 : 1}
            gap={gap_between_label_and_input}
          >
            {/* project name */}
            <FormControl isInvalid={!!errors.project_name} isRequired>
              <FormLabel>Project Name</FormLabel>
              <Input
                type="text"
                placeholder="Project Name"
                {...register("project_name", {
                  required: "This field is required",
                })}
              />
              <FormErrorMessage>
                {errors.project_name?.message}
              </FormErrorMessage>
            </FormControl>

            {/* location */}
            <FormControl
              isInvalid={
                !!errors.location_id && getValues("location_id") === ""
              }
              isRequired
              isReadOnly
            >
              <FormLabel>Location</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  {...register("location_id", {
                    required: "This field is required",
                  })}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="select-location"
                    onClick={onLocationDrawerOpen}
                  >
                    <IconSelect
                      style={{ cursor: "pointer", rotate: "-90deg" }}
                    />
                  </IconButton>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.location_id?.message}</FormErrorMessage>

              {/* location drawer */}
              <Drawer
                size="md"
                isOpen={isLocationDrawerOpen}
                // isOpen
                placement="right"
                onClose={onLocationDrawerClose}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader borderBottomWidth="1px">Locations</DrawerHeader>

                  <DrawerBody>
                    <TableContainer>
                      <Table size="sm" variant="unstyled">
                        <Thead>
                          <Tr
                            bgColor={
                              colorMode === "light" ? "#e2e8f0" : "#0f172a"
                            }
                          >
                            <Th>Display Location</Th>
                            <Th>State</Th>
                            <Th>Country</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {/* loading state */}
                          {projectLocationsLoading && <p>Loading data...</p>}
                          {/* If error while fetching locations data from db */}
                          {projectLocationsError !== null && (
                            <HStack>
                              <Text mx="auto">
                                {projectLocationsError.message}
                              </Text>
                            </HStack>
                          )}
                          {/* location table - display_location, state, country */}
                          {projectLocations?.data.map(loc => {
                            return (
                              <Tr
                                key={loc.location_id}
                                borderBottom="1px solid white"
                                bgColor={
                                  loc.location_id === getValues("location_id")
                                    ? colorMode === "light"
                                      ? "#f1f5f9"
                                      : "#1e293b"
                                    : ""
                                }
                                _hover={{
                                  cursor: "pointer",
                                  backgroundColor:
                                    colorMode === "light"
                                      ? "#f1f5f9"
                                      : "#1e293b",
                                }}
                                onClick={() =>
                                  closeLocationDrawer(loc.location_id)
                                }
                              >
                                <Td>
                                  {loc.display_location === null
                                    ? "N/A"
                                    : loc.display_location}
                                </Td>
                                <Td>
                                  {loc.state === null ? "N/A" : loc.state}
                                </Td>
                                <Td>
                                  {loc.country === null ? "N/A" : loc.country}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </DrawerBody>

                  <DrawerFooter borderTopWidth="1px">
                    <Button
                      mr={3}
                      onClick={() => closeLocationDrawer("")}
                      bgColor={colorMode === "light" ? "#ef4444" : "#dc2626"}
                      _hover={{
                        bgColor: colorMode === "light" ? "#dc2626" : "#b91c1c",
                      }}
                      _active={{
                        transform: "scale(0.95)",
                        bgColor: colorMode === "light" ? "#dc2626" : "#dc2626",
                      }}
                    >
                      <IconX />
                      <Text as={Flex} justifyContent="center">
                        remove
                      </Text>
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </FormControl>

            {/* latitude */}
            <FormControl>
              <FormLabel>Latitude</FormLabel>
              <NumberInput>
                <NumberInputField {...register("lat_long.0")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* longitude */}
            <FormControl>
              <FormLabel>Longitude</FormLabel>
              <NumberInput>
                <NumberInputField {...register("lat_long.1")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </Grid>

        <Divider border="1px" />

        {/* share information */}
        <Grid as={GridItem} gridTemplateColumns={grid_template_cols} gap={2}>
          {/* block title */}
          <GridItem colSpan={isPhone ? 3 : 1} position="relative">
            <Heading
              position="sticky"
              top="7rem"
              h="fit-content"
              as="h3"
              size="md"
              fontWeight="500"
            >
              Share Information
            </Heading>
          </GridItem>

          <GridItem colSpan={isPhone ? 3 : 1}>
            <Divider orientation={isPhone ? "horizontal" : "vertical"} />
          </GridItem>

          {/* block inputs */}
          <VStack
            as={GridItem}
            colSpan={isPhone ? 3 : 1}
            gap={gap_between_label_and_input}
          >
            {/* total shares */}
            <FormControl isInvalid={!!errors.total_shares}>
              <FormLabel>Total Shares</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("total_shares")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* available shares */}
            <FormControl isInvalid={!!errors.available_shares}>
              <FormLabel>Available Shares</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("available_shares")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* total shares to display */}
            <FormControl isInvalid={!!errors.total_shares_to_display}>
              <FormLabel>Total Shares To Display</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("total_shares_to_display")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* available shares to display */}
            <FormControl isInvalid={!!errors.available_shares_to_display}>
              <FormLabel>Available Shares To Display</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  {...register("available_shares_to_display")}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </Grid>

        <Divider border="1px" />

        {/* area information */}
        <Grid as={GridItem} gridTemplateColumns={grid_template_cols} gap={2}>
          {/* block title */}
          <GridItem colSpan={isPhone ? 3 : 1} position="relative" mr={4}>
            <Heading
              position="sticky"
              top="7rem"
              h="fit-content"
              as="h3"
              size="md"
              fontWeight="500"
            >
              Area Information
            </Heading>
          </GridItem>

          <GridItem colSpan={isPhone ? 3 : 1}>
            <Divider orientation={isPhone ? "horizontal" : "vertical"} />
          </GridItem>

          {/* block inputs */}
          <VStack
            as={GridItem}
            colSpan={isPhone ? 3 : 1}
            gap={gap_between_label_and_input}
          >
            {/* built up area */}
            <FormControl isInvalid={!!errors.built_up_area}>
              <FormLabel>Built up Area</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("built_up_area")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* plot area */}
            <FormControl isInvalid={!!errors.plot_area}>
              <FormLabel>Plot Area</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("plot_area")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* carpet area */}
            <FormControl isInvalid={!!errors.carpet_area}>
              <FormLabel>Carpet Area</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("carpet_area")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* super area */}
            <FormControl isInvalid={!!errors.super_area}>
              <FormLabel>Super Area</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("super_area")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </VStack>
        </Grid>

        <Divider border="1px" />

        {/* property information */}
        <Grid as={GridItem} gridTemplateColumns={grid_template_cols} gap={2}>
          {/* block title */}
          <GridItem colSpan={isPhone ? 3 : 1} position="relative">
            <Heading
              position="sticky"
              top="7rem"
              h="fit-content"
              as="h3"
              size="md"
              fontWeight="500"
            >
              Property Information
            </Heading>
          </GridItem>

          <GridItem colSpan={isPhone ? 3 : 1}>
            <Divider orientation={isPhone ? "horizontal" : "vertical"} />
          </GridItem>

          {/* block inputs */}
          <VStack
            as={GridItem}
            colSpan={isPhone ? 3 : 1}
            gap={gap_between_label_and_input}
          >
            {/* bhk configuration */}
            <FormControl isInvalid={!!errors.bhk_configuration} isRequired>
              <FormLabel>BHK Configuration</FormLabel>
              <Select
                size="lg"
                placeholder="Select bhk"
                {...register("bhk_configuration", {
                  required: "This field is required!",
                })}
              >
                {configsData?.data.bhk_configurations.map(bhk => (
                  <option key={bhk.id} value={bhk.value}>
                    {bhk.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.bhk_configuration?.message}
              </FormErrorMessage>
            </FormControl>

            {/* property count */}
            <FormControl>
              <FormLabel>Property Count</FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...register("property_count")} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            {/* category */}
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                size="lg"
                placeholder="Select category"
                {...register("category")}
              >
                {configsData?.data.categories.map(category => (
                  <option key={category.id} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* property type */}
            <FormControl>
              <FormLabel>Property Type</FormLabel>
              <Select
                size="lg"
                placeholder="Select property type"
                {...register("property_type")}
              >
                {configsData?.data.property_types.map(prop_type => (
                  <option key={prop_type.id} value={prop_type.value}>
                    {prop_type.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* available buy options */}
            <FormControl>
              <FormLabel>Available Buy Options</FormLabel>
              <Select size="lg" {...register("available_buy_options")}>
                {configsData?.data.available_buy_options.map(buy_option => (
                  <option key={buy_option.id} value={buy_option.value}>
                    {buy_option.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </Grid>

        <Divider border="1px" />

        {/* project flags */}
        <Grid as={GridItem} gridTemplateColumns={grid_template_cols} gap={2}>
          {/* block title */}
          <GridItem colSpan={isPhone ? 3 : 1} position="relative">
            <Heading
              position="sticky"
              top="7rem"
              h="fit-content"
              as="h3"
              size="md"
              fontWeight="500"
            >
              Project Flags
            </Heading>
          </GridItem>

          <GridItem colSpan={isPhone ? 3 : 1}>
            <Divider orientation={isPhone ? "horizontal" : "vertical"} />
          </GridItem>

          {/* block inputs */}
          <SimpleGrid
            as={GridItem}
            minChildWidth="165px"
            colSpan={isPhone ? 3 : 1}
            gap={gap_between_label_and_input}
          >
            {/* soldout */}
            <FormControl>
              <Checkbox {...register("soldout")}>Sold Out</Checkbox>
            </FormControl>

            {/* is_featured_project */}
            <FormControl>
              <Checkbox {...register("is_featured_project")}>
                Is Featured Project
              </Checkbox>
            </FormControl>

            {/* is_active_in_website */}
            <FormControl>
              <Checkbox {...register("is_active_in_website")}>
                Is Active On Website
              </Checkbox>
            </FormControl>

            {/* is_test_project */}
            <FormControl>
              <Checkbox {...register("is_test_project")}>
                Is Test Project
              </Checkbox>
            </FormControl>
          </SimpleGrid>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={3}>
        <LeaveSubmitButton
          isDisabled={saveAndContinueLoading}
          isLoading={saveAndLeaveLoading}
          onClick={handleSubmit(onSave)}
        />
        <ContinueSubmitButton
          isDisabled={saveAndLeaveLoading}
          isLoading={saveAndContinueLoading}
          onClick={handleSubmit(onSaveandContinue)}
        />
      </Box>
    </form>
  );
};

// <Edit
//   isLoading={isFormLoading || isProjectDataLoading}
//   wrapperProps={{
//     maxWidth: '768px',
//     mx: 'auto',
//     px: isPhone ? '0.8rem' : '2.5rem',
//   }}
//   headerProps={{ p: 2 }}
//   title={<FormTitle property={projectData?.project_name} />}
//   headerButtonProps={{ display: 'none' }}
// >

// </Edit>
