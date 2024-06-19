"use client";
import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useOne } from "@refinedev/core";
import { Show } from "@/components/crud";
import { FormTitle, ShowHeaderButtons } from "@/components/ui";
// import { useParams } from "react-router-dom";
import { TLocation } from "@/types";
import { getMonthName, getTimeandDate } from "@/utils/fn";
import { useParams } from "next/navigation";

const RESOURCE = "locations";

const LocationShow = () => {
  const { id } = useParams<{ id: string }>();

  const { data: locationData, isLoading: locationIsLoading } =
    useOne<TLocation>({
      resource: RESOURCE,
      id,
      meta: {
        idColumnName: "location_id",
      },
    });

  const seasons = locationData?.data.seasons;
  const special_days_calender = locationData?.data.special_days_calender ?? {};
  const years_of_special_calender = Object.keys(special_days_calender);

  return (
    <Show
      isLoading={locationIsLoading}
      wrapperProps={{ maxWidth: "768px", mx: "auto" }}
      breadcrumb={null}
      title={<FormTitle property={locationData?.data.location_name} />}
      headerButtons={
        <ShowHeaderButtons
          resource={RESOURCE}
          id={id}
          columnToMatchBy="location_id"
          keepEditMenu={false}
          deleted={locationData?.data.deleted}
        />
      }
    >
      <Divider />

      <Grid my={8} gap={4}>
        {/* location information */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={4}>
          <Box as={GridItem} colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Basic Info
            </Heading>
          </Box>
          <VStack
            as={GridItem}
            alignItems="flex-start"
            gap={4}
            colSpan={{ base: 2, sm: 1 }}
          >
            <Box gap={2}>
              <Heading as="h4" size="sm">
                Location Id
              </Heading>
              <Text fontSize="sm" wordBreak="break-all">
                {locationData?.data.location_id}
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="sm">
                Location Name
              </Heading>
              <Text>{locationData?.data.location_name || "-"}</Text>
            </Box>
            <Box>
              <Heading as="h4" size="sm">
                State
              </Heading>
              <Text>{locationData?.data.state || "-"}</Text>
            </Box>
            <Box>
              <Heading as="h4" size="sm">
                Country
              </Heading>
              <Text>{locationData?.data.country || "-"}</Text>
            </Box>
            <Box>
              <Heading as="h4" size="sm">
                Created At
              </Heading>
              <Text>
                {getTimeandDate(locationData?.data.created_at) || "N/A"}
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="sm">
                Updated At
              </Heading>
              <Text>
                {getTimeandDate(locationData?.data.updated_at) || "N/A"}
              </Text>
            </Box>
            <Box>
              <Heading as="h4" size="sm">
                Display Location
              </Heading>
              <Text>
                {(locationData?.data.display_location as string) ?? "N/A"}
              </Text>
            </Box>
          </VStack>
        </Grid>

        <Divider />

        {/* peak season */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={4}>
          <Box as={GridItem} colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Seasons
            </Heading>
          </Box>
          {seasons ? (
            <Box>
              {seasons.peak_seasons ? (
                <Box>
                  <Text>Peak Seasons</Text>
                  <TableContainer
                    as={GridItem}
                    pr={8}
                    colSpan={{ base: 2, sm: 1 }}
                  >
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Start Date</Th>
                          <Th>End Date</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {locationData?.data.seasons.peak_seasons !== null &&
                          locationData?.data.seasons.peak_seasons.map(
                            (season, idx) => {
                              return (
                                <Tr key={`season-${idx + 1}`}>
                                  <Td>
                                    {season.start_date.day}&nbsp;
                                    {getMonthName(season.start_date.month)}
                                  </Td>
                                  <Td>
                                    {season.end_date.day}&nbsp;
                                    {getMonthName(season.end_date.month)}
                                  </Td>
                                </Tr>
                              );
                            }
                          )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Text>No seasons availalbe</Text>
              )}
            </Box>
          ) : (
            <Text>No Seasons Available</Text>
          )}
        </Grid>

        <Divider />

        {/* special days calender */}
        <Grid as={GridItem} gap={4}>
          <Heading as="h4" size="md">
            Special Days Calender
          </Heading>
          {years_of_special_calender.length > 0 ? (
            <Tabs>
              <TabList>
                {years_of_special_calender.map((year) => (
                  <Tab key={year}>
                    <Button size="sm" variant="ghost">
                      {year}
                    </Button>
                  </Tab>
                ))}
              </TabList>
              <TabPanels>
                {years_of_special_calender.map((year) => (
                  <TabPanel key={year}>
                    <TableContainer>
                      <Table>
                        <Thead>
                          <Tr>
                            <Td>Name of Festival</Td>
                            <Td>Start Date</Td>
                            <Td>End Date</Td>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {special_days_calender[year] === null
                            ? null
                            : special_days_calender[year].map(
                                (calender, idx) => (
                                  <Tr key={idx}>
                                    <Td>{calender.name}</Td>
                                    <Td>
                                      {calender.start_date.day}&nbsp;
                                      {getMonthName(calender.start_date.month)}
                                    </Td>
                                    <Td>
                                      {calender.end_date.day}&nbsp;
                                      {getMonthName(calender.end_date.month)}
                                    </Td>
                                  </Tr>
                                )
                              )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          ) : (
            <Text>No Special Calender availalbe</Text>
          )}
        </Grid>
      </Grid>
    </Show>
  );
};

export default LocationShow;
