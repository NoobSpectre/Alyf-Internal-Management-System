"use client";

import { Create } from "@/components/crud";
import { FormTitle, ShowHeaderButtons } from "@/components/ui";
import { TConfig, TLocation, TOption, TProject } from "@/types";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import { DateField, NumberField } from "@refinedev/chakra-ui";
import { useOne } from "@refinedev/core";
import { IconSquareCheck, IconSquareX } from "@tabler/icons-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/styles.css";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const LOC_TABLE = "locations";
const RESOURCE = "projects";
const CONFIGS_TABLE = "configs";

const ProjectShow = () => {
  const [open_hero, setOpen_hero] = useState(false);
  const [open_projectImage, setOpen_projectImage] = useState(false);
  const [open_project_videos, setOpen_project_videos] = useState(false);
  const [image_array, setImage_array] = useState([{ src: "" }]);

  const { id } = useParams<{ id: string }>();
  const [isPhone] = useMediaQuery("(max-width: 570px)");

  const { data: projectData, isLoading: projectIsLoading } = useOne<TProject>({
    resource: RESOURCE,
    id,
    meta: {
      idColumnName: "project_id",
    },
  });

  console.log(projectData);

  const { data: locationData, isLoading: locationIsLoading } =
    useOne<TLocation>({
      resource: LOC_TABLE,
      id: projectData?.data.location_id,
    });

  const {
    data: configsData,
    isLoading: isConfigsDataLoading,
    isError: isConfigsError,
  } = useOne<TConfig>({
    resource: CONFIGS_TABLE,
    id: "7622f753-4406-4ac9-b770-78cd949afb0d",
    meta: { idColumnName: "config_id" },
  });

  // Checkikng Array data if they are not available then assign them a empty array

  const Investment_breakdown_data =
    projectData?.data.investment_breakdown ?? [];
  const OtherChargesData = projectData?.data?.other_charges ?? [];
  const aminities = projectData?.data?.amenities ?? [];
  const features = projectData?.data?.features ?? [];
  const full_investment_breakdown_data =
    projectData?.data?.full_investment_breakdown ?? [];
  const full_other_charges_data = projectData?.data?.full_other_charges ?? [];
  const location_description = projectData?.data?.location_description ?? [];
  const project_description = projectData?.data?.project_description ?? [];
  const rental_prospect_description =
    projectData?.data?.rental_prospect_description ?? [];

  const projectMedia = projectData?.data?.project_media;

  let category_wise_project_image: { src: string }[][] = [];

  console.log(configsData?.data);
  // configsData?.data.tags.forEach((tag) => {
  //   category_wise_project_image.push([]);
  // });
  // configsData?.data.tags.forEach((tag_obj, index) => {
  //   projectMedia?.images.forEach((img_obj) => {
  //     img_obj.tags.forEach((tag) => {
  //       if (tag === tag_obj.value) {
  //         category_wise_project_image[index].push({ src: img_obj.url });
  //       }
  //     });
  //   });
  // });

  const hero_image: string[] = projectData?.data?.hero_images ?? [];

  const hero_image_array = [{ src: "" }];

  hero_image.forEach(element => {
    hero_image_array.push({ src: element });
  });
  hero_image_array.shift();

  let project_video_array = [
    {
      src: "https://youtu.be/XPGFqx8Vg-Y?si=64AKOGhOX66AaYsN",
      type: "video/mp4",
    },
    {
      src: "https://youtu.be/nNTiK9lB9sI?si=CtUwNzis7RpcaG9V",
      type: "video/mp4",
    },
  ];

  return (
    <Create
      isLoading={projectIsLoading}
      wrapperProps={{
        maxWidth: "768px",
        mx: "auto",
        px: isPhone ? "0.8rem" : "2.5rem",
      }}
      title={<FormTitle property={projectData?.data?.project_name} />}
      headerProps={{ p: 2 }}
      headerButtons={
        <ShowHeaderButtons
          resource={RESOURCE}
          id={projectData?.data?.project_id}
          columnToMatchBy="project_id"
          deleted={projectData?.data?.deleted}
        />
      }
    >
      {/* basic information */}
      <Grid my={8} gap={5}>
        {/* Basic info */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={2}>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Basic Info
            </Heading>
          </GridItem>
          <GridItem as={Grid} colSpan={{ base: 2, sm: 1 }} gap={4}>
            <Box>
              <Heading as="h5" size="small">
                Project Name
              </Heading>
              <Text>
                {projectData?.data?.project_name
                  ? projectData?.data?.project_name
                  : "N/A"}
              </Text>
            </Box>

            <Box>
              <Heading as="h5" size="small">
                Location Name
              </Heading>
              <Text>{locationData?.data?.location_name}</Text>
            </Box>

            <Box>
              <Heading as="h5" size="small">
                Creation Date
              </Heading>
              <DateField value={projectData?.data?.created_at} />
            </Box>

            <Box>
              <Heading as="h5" size="small">
                Updation Date
              </Heading>
              <DateField
                value={
                  projectData?.data?.updated_at ?? projectData?.data?.created_at
                }
              />
            </Box>

            <Box>
              <Heading as="h5" size="small">
                Project Id
              </Heading>
              <Text>{projectData?.data?.project_id}</Text>
            </Box>
          </GridItem>
        </Grid>

        <Divider as={GridItem} w="100%" />

        {/* Share information */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={2}>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Share Information
            </Heading>
          </GridItem>
          <GridItem as={Grid} colSpan={{ base: 2, sm: 1 }} gap={4}>
            <Box>
              <Heading as="h5" size="small">
                Total Shares
              </Heading>
              <NumberField value={projectData?.data?.total_shares ?? 0} />
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Available Shares
              </Heading>
              <NumberField value={projectData?.data?.available_shares ?? 0} />
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Total Shares to display
              </Heading>
              <NumberField
                value={projectData?.data?.total_shares_to_display ?? 0}
              />
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Available Shares to display
              </Heading>
              <NumberField
                value={projectData?.data?.available_shares_to_display ?? 0}
              />
            </Box>
          </GridItem>
        </Grid>

        <Divider />

        {/* project area information */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={2}>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Project Area Information
            </Heading>
          </GridItem>
          <GridItem as={Grid} colSpan={{ base: 2, sm: 1 }} gap={4}>
            <Box>
              <Heading as="h5" size="small">
                Built up Area
              </Heading>
              <NumberField value={projectData?.data?.built_up_area ?? 0} />
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Plot Area
              </Heading>
              <NumberField value={projectData?.data?.plot_area ?? 0} />
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Carpet Area
              </Heading>
              <NumberField value={projectData?.data?.carpet_area ?? 0} />
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Super Area
              </Heading>
              <NumberField value={projectData?.data?.super_area ?? 0} />
            </Box>
          </GridItem>
        </Grid>

        <Divider />

        {/* property information */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={2}>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Property Information
            </Heading>
          </GridItem>
          <GridItem as={Grid} colSpan={{ base: 2, sm: 1 }} gap={4}>
            <Box>
              <Heading as="h5" size="small">
                BHK Configuration
              </Heading>
              <Text>
                {projectData?.data?.bhk_configuration
                  ? projectData?.data?.bhk_configuration
                  : "N/A"}
              </Text>
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Property Count
              </Heading>
              <NumberField value={projectData?.data?.property_count ?? 0} />
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Category
              </Heading>
              <Text>
                {projectData?.data?.category
                  ? projectData?.data?.category
                  : "N/A"}
              </Text>
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Property Type
              </Heading>
              <Text>
                {projectData?.data?.property_type
                  ? projectData?.data?.property_type
                  : "N/A"}
              </Text>
            </Box>
            <Box>
              <Heading as="h5" size="small">
                Available Buy Option
              </Heading>
              <Text>{projectData?.data?.available_buy_options}</Text>
            </Box>
          </GridItem>
        </Grid>

        <Divider />

        {/* Flags */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={2}>
          <Box as={GridItem} colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Flags
            </Heading>
          </Box>
          <SimpleGrid
            gap={2}
            as={GridItem}
            minChildWidth="165px"
            colSpan={{ base: 2, sm: 1 }}
          >
            <Flex gap={1}>
              {projectData?.data?.is_test_project ? (
                <IconSquareCheck />
              ) : (
                <IconSquareX />
              )}
              <Text w="fit-content">Is test project</Text>
            </Flex>
            <Flex gap={1}>
              {projectData?.data?.is_active_in_website ? (
                <IconSquareCheck />
              ) : (
                <IconSquareX />
              )}
              <Text>Is active on Website</Text>
            </Flex>
            <Flex gap={1}>
              {projectData?.data?.is_featured_project ? (
                <IconSquareCheck />
              ) : (
                <IconSquareX />
              )}
              <Text>Is featured project</Text>
            </Flex>
            <Flex gap={1}>
              {projectData?.data?.soldout ? (
                <IconSquareCheck />
              ) : (
                <IconSquareX />
              )}
              <Text>Sold Out</Text>
            </Flex>
          </SimpleGrid>
        </Grid>

        <Divider />

        {/* Amenities */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={2}>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Amenities
            </Heading>
          </GridItem>
          <SimpleGrid
            as={GridItem}
            minChildWidth="140px"
            colSpan={{ base: 2, sm: 1 }}
            gap={2}
          >
            {aminities.length > 0 ? (
              aminities.map((item: String, index: number) => (
                <Text key={index}>{item}</Text>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </SimpleGrid>
        </Grid>

        <Divider />

        {/* Features */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr" gap={2}>
          <GridItem colSpan={{ base: 2, sm: 1 }}>
            <Heading
              as="h4"
              size="md"
              style={{ position: "sticky", top: "7rem" }}
            >
              Features
            </Heading>
          </GridItem>
          <SimpleGrid
            as={GridItem}
            minChildWidth="140px"
            colSpan={{ base: 2, sm: 1 }}
            gap={2}
          >
            {features.length > 0 ? (
              features.map((item: String, index: number) => (
                <Text key={index}>{item}</Text>
              ))
            ) : (
              <Text>N/A</Text>
            )}
          </SimpleGrid>
        </Grid>

        <Divider />

        {/* investement breakdown */}
        <Grid as={GridItem}>
          <Heading as="h4" size="md" mb="0.5rem">
            Investment Breakdown
          </Heading>
          {Investment_breakdown_data.length > 0 ? (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Label</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Investment_breakdown_data.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td>{item.label}</Td>
                      <Td>{item.amount}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text>N/A</Text>
          )}
        </Grid>

        <Divider />

        {/* full investement breakdown */}
        <Grid as={GridItem}>
          <Heading as="h4" size="md" mb="0.5rem">
            Full Investment Breakdown
          </Heading>

          {full_investment_breakdown_data.length > 0 ? (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Label</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {full_investment_breakdown_data.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td>{item.label}</Td>
                      <Td>{item.amount}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text>N/A</Text>
          )}
        </Grid>

        <Divider />

        {/* Other Charges */}

        <Grid as={GridItem}>
          <Heading as="h4" size="md" mb="0.5rem">
            Other Charges
          </Heading>

          {OtherChargesData.length > 0 ? (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Label</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {OtherChargesData.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td>{item.label}</Td>
                      <Td>{item.amount}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text>N/A</Text>
          )}
        </Grid>

        <Divider />

        {/* Full Other Charges */}

        <Box as={GridItem}>
          <Heading as="h4" size="md" mb="0.5rem">
            Full Other Charges
          </Heading>

          {full_other_charges_data.length > 0 ? (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Label</Th>
                    <Th>Price</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {full_other_charges_data.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td>{item.label}</Td>
                      <Td>{item.amount}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text>N/A</Text>
          )}
        </Box>

        <Divider />

        {/* location description */}
        <Grid as={GridItem} gap={2}>
          <Heading as="h4" size="md">
            Location Description
          </Heading>
          {location_description.length > 0 ? (
            <Box gap={4}>
              {location_description.map((element: string, index: number) =>
                index === 0 ? (
                  <div key={index}>
                    <strong>Title : </strong>
                    {element}
                  </div>
                ) : (
                  <div key={index}>
                    {index === 1 ? (
                      <div key={index}>
                        <strong>Description : </strong>
                        {element}
                      </div>
                    ) : (
                      <div style={{ marginTop: "10px" }}>{element}</div>
                    )}
                  </div>
                )
              )}
            </Box>
          ) : (
            <Box>
              <Text>N/A</Text>
            </Box>
          )}
        </Grid>

        <Divider />

        {/* project description */}
        <Grid as={GridItem} gap={2}>
          <Heading as="h4" size="md">
            Project Description
          </Heading>
          {project_description.length > 0 ? (
            <Box gap={4}>
              {project_description.map((element: string, index: number) =>
                index === 0 ? (
                  <div key={index}>
                    <strong>Title : </strong>
                    {element}
                  </div>
                ) : (
                  <div key={index}>
                    {index === 1 ? (
                      <div>
                        <strong>Description : </strong>
                        {element}
                      </div>
                    ) : (
                      <div style={{ marginTop: "10px" }}>{element}</div>
                    )}
                  </div>
                )
              )}
            </Box>
          ) : (
            <Box>
              <Text>N/A</Text>
            </Box>
          )}
        </Grid>

        <Divider />

        {/* Rental prospect description */}
        <Grid as={GridItem} gap={2}>
          <Heading as="h4" size="md">
            Rental Prospect Description
          </Heading>
          {rental_prospect_description.length > 0 ? (
            <Box gap={4}>
              {rental_prospect_description.map(
                (element: string, index: number) =>
                  index === 0 ? (
                    <div key={index}>
                      <strong>Title : </strong>
                      {element}
                    </div>
                  ) : (
                    <div key={index}>
                      {index === 1 ? (
                        <div>
                          <strong>Description : </strong>
                          {element}
                        </div>
                      ) : (
                        <div style={{ marginTop: "10px" }}>{element}</div>
                      )}
                    </div>
                  )
              )}
            </Box>
          ) : (
            <Box>
              <Text>N/A</Text>
            </Box>
          )}
        </Grid>

        <Divider />

        {/* Project Images */}
        <Grid as={GridItem} gap={2}>
          <Heading as="h4" size="md">
            Property Images
          </Heading>
          <HStack flexWrap="wrap">
            {category_wise_project_image.length > 0 ? (
              configsData?.data.tags.map((item: TOption, index: number) => (
                <Button
                  onClick={() => {
                    setImage_array(category_wise_project_image[index]);
                    setOpen_projectImage(true);
                  }}
                  key={index}
                  isDisabled={category_wise_project_image[index].length < 1}
                >
                  {item.label}
                </Button>
              ))
            ) : (
              <Heading as="h5" size="sm">
                No images right now
              </Heading>
            )}
          </HStack>
          <Lightbox
            plugins={[Counter]}
            counter={{ container: { style: { top: "unset", bottom: 0 } } }}
            open={open_projectImage}
            close={() => setOpen_projectImage(false)}
            slides={image_array}
          />
        </Grid>

        {/* project videos */}

        <Grid as={GridItem} gridTemplateColumns="1fr 1fr">
          <Heading as="h4" size="md">
            Property videos
          </Heading>
          <Button onClick={() => setOpen_project_videos(true)}>
            show Vidoes
          </Button>
          <Lightbox
            plugins={[Video, Counter]}
            counter={{ container: { style: { top: "unset", bottom: 0 } } }}
            open={open_project_videos}
            close={() => setOpen_project_videos(false)}
            slides={[
              {
                type: "video",
                width: 1280,
                height: 720,
                poster: "/public/poster-image.jpg",
                sources: [...project_video_array],
              },
              // ...
            ]}
            // ...
          />
        </Grid>

        <Divider />
        {/* Hero image */}
        <Grid as={GridItem} gridTemplateColumns="1fr 1fr">
          <Box as={GridItem} colSpan={{ base: 2, sm: 1 }}>
            <Heading as="h4" size="md">
              Hero image
            </Heading>
          </Box>
          <SimpleGrid
            as={GridItem}
            colSpan={{ base: 2, sm: 1 }}
            minChildWidth="100px"
            onClick={() => setOpen_hero(true)}
          >
            {hero_image.length > 0 ? (
              hero_image.map((image, idx) => (
                <Image
                  key={idx}
                  src={image}
                  alt={"hero image " + idx + 1}
                  width={100}
                  height={100}
                />
              ))
            ) : (
              <Text>N/A</Text>
            )}
            <Lightbox
              plugins={[Counter]}
              counter={{ container: { style: { top: "unset", bottom: 0 } } }}
              open={open_hero}
              close={() => setOpen_hero(false)}
              slides={[...hero_image_array]}
            />
          </SimpleGrid>
        </Grid>

        <Divider />
        {/* Brosure */}
        <Grid as={GridItem}>
          <Heading as="h4" size="md">
            Brochure
          </Heading>

          {projectData?.data?.brochure_url ? (
            <Link
              href={`${projectData.data?.brochure_url}`}
              style={{ justifyContent: "center", display: "flex" }}
            >
              Show pdf
            </Link>
          ) : (
            <Text>N/A</Text>
          )}
        </Grid>
      </Grid>
    </Create>
  );
};

export default ProjectShow;