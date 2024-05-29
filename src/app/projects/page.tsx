"use client";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spinner,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorMode,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { ShowButton } from "@refinedev/chakra-ui";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { IconArrowRight, IconMinus, IconPencil } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { List } from "@/components/crud";
import { DeployUI, Pagination, StateUpdateButton } from "@/components/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TProject } from "@/types";
import { updateProjectState } from "@/utils/db";
import { getTimeandDate } from "@/utils/fn";
import { useUserRole } from "@/hooks/useUserRole";
import modifyParams from "@/lib/functions/modifyParams";

const RESOURCE = "projects"; // update to -> projects
const COLUMN_TO_MATCH_BY = "project_id";
const DEFAULT_PAGESIZE = 10;

export default function ProjectList() {
  const [projectUpdating, setProjectUpdating] = useState(false);

  const toast = useToast();
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [isPhone] = useMediaQuery("(max-width: 570px)");

  const { userRole } = useUserRole();

  const handleBtnClick = useCallback(
    async (id: string, newState: boolean) => {
      setProjectUpdating(true);

      await updateProjectState({
        toast,
        supabaseOptions: {
          from: RESOURCE,
          id,
          columnToMatchBy: COLUMN_TO_MATCH_BY,
          newState,
        },
      });

      queryClient.invalidateQueries({
        type: "all",
      });

      setProjectUpdating(false);
    },
    [queryClient, toast]
  );

  const columns = useMemo<ColumnDef<TProject>[]>(
    () => [
      {
        id: "project_name",
        accessorKey: "project_name",
        header: "Project Name",
        cell: ({ getValue }) => (
          <Flex>
            <Tooltip label={getValue() as string} placement="top" hasArrow>
              <Text noOfLines={1} pb={0.5}>
                {getValue() as string}
              </Text>
            </Tooltip>
          </Flex>
        ),
      },
      {
        id: "bhk_configuration",
        accessorKey: "bhk_configuration",
        header: "BHK Configuration",
        cell: ({ getValue }) => <Text>{getValue() as string}</Text>,
      },
      {
        id: "property_count",
        accessorKey: "property_count",
        header: "Property Count",
        cell: ({ getValue }) => <Text>{getValue() as string}</Text>,
      },

      {
        id: "category",
        accessorKey: "category",
        header: "Category",

        cell: ({ getValue }) => (
          <Flex>
            {getValue() ? (
              <Text>{getValue() as string}</Text>
            ) : (
              <Icon as={IconMinus} />
            )}
          </Flex>
        ),
      },

      {
        id: "property_type",
        accessorKey: "property_type",
        header: "Property Type",

        cell: ({ getValue }) => (
          <Flex>
            {getValue() ? (
              <Text>{getValue() as string}</Text>
            ) : (
              <Icon as={IconMinus} />
            )}
          </Flex>
        ),
      },

      {
        id: "available_buy_options",
        accessorKey: "available_buy_options",
        header: "Available Buy Options",

        cell: ({ getValue }) => <Text>{getValue() as string}</Text>,
      },

      {
        id: "stages_completed",
        accessorKey: "stages_completed",
        header: () => "Stages Completed",
        cell: ({ getValue }) => (
          <Text>
            <b>{getValue() as string}</b> / <b>6</b>
          </Text>
        ),
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Created At",

        cell: ({ getValue }) => (
          <Text>
            {getValue() ? getTimeandDate(getValue() as string, true) : "-"}
          </Text>
        ),
      },
      {
        id: "updated_at",
        accessorKey: "updated_at",
        header: "Updated At",

        cell: ({ getValue }) => (
          <Text>
            {getValue() ? getTimeandDate(getValue() as string, true) : "-"}
          </Text>
        ),
      },
      {
        id: "actions",
        accessorKey: "project_id",
        header: "Actions",
        cell: ({ getValue, row }) => (
          <HStack justify="center">
            <ShowButton
              hideText
              recordItemId={getValue() as string}
              size="xs"
              colorScheme="whatsapp"
              svgIconProps={{ size: "0.9rem" }}
            />

            {userRole === "PANEL_ADMIN" ? (
              <>
                <Menu size="sm" isLazy placement="left">
                  <MenuButton
                    as={IconButton}
                    size="xs"
                    aria-label="Options"
                    colorScheme="messenger"
                    icon={<IconPencil size="0.9rem" />}
                    variant="outline"
                  />
                  <MenuList minW="fit-content" px={2}>
                    <MenuItem
                      as={Link}
                      href={`${RESOURCE}/edit/${getValue() as string}`}
                      colorScheme="messenger"
                      display="flex"
                      justifyContent="space-between"
                      gap={4}
                      style={{ textDecorationLine: "none" }}
                    >
                      <Text>Basic Info</Text>
                      <Icon as={IconArrowRight} fontSize="0.8rem" />
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href={`${RESOURCE}/edit/${getValue() as string}?stage=2`}
                      colorScheme="messenger"
                      display="flex"
                      justifyContent="space-between"
                      gap={4}
                      style={{ textDecorationLine: "none" }}
                    >
                      <Text>Description</Text>
                      <Icon as={IconArrowRight} fontSize="0.8rem" />
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href={`${RESOURCE}/edit/${getValue() as string}?stage=3`}
                      colorScheme="messenger"
                      display="flex"
                      justifyContent="space-between"
                      gap={4}
                      style={{ textDecorationLine: "none" }}
                    >
                      <Text>Pricing</Text>
                      <Icon as={IconArrowRight} fontSize="0.8rem" />
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href={`${RESOURCE}/edit/${getValue() as string}?stage=4`}
                      colorScheme="messenger"
                      display="flex"
                      justifyContent="space-between"
                      gap={4}
                      style={{ textDecorationLine: "none" }}
                    >
                      <Text>Image</Text>
                      <Icon as={IconArrowRight} fontSize="0.8rem" />
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href={`${RESOURCE}/edit/${getValue() as string}?stage=5`}
                      colorScheme="messenger"
                      display="flex"
                      justifyContent="space-between"
                      gap={4}
                      style={{ textDecorationLine: "none" }}
                    >
                      <Text>Video</Text>
                      <Icon as={IconArrowRight} fontSize="0.8rem" />
                    </MenuItem>
                    <MenuItem
                      as={Link}
                      href={`${RESOURCE}/edit/${getValue() as string}?stage=6`}
                      colorScheme="messenger"
                      display="flex"
                      justifyContent="space-between"
                      gap={4}
                      style={{ textDecorationLine: "none" }}
                    >
                      <Text>Brochure</Text>
                      <Icon as={IconArrowRight} fontSize="0.8rem" />
                    </MenuItem>
                  </MenuList>
                </Menu>
                <StateUpdateButton
                  state={row.original.deleted}
                  id={getValue() as string}
                  handleBtnClick={handleBtnClick}
                />
              </>
            ) : null}
          </HStack>
        ),
      },
    ],
    [handleBtnClick, userRole]
  );

  const { data: listData, isLoading: isListDataLoading } = useList<TProject>({
    resource: RESOURCE,
    config: {
      filters: [
        {
          field: "deleted",
          operator: "eq",
          value: searchParams.get("deleted") === "true" ? true : false,
        },
      ],
      sort: [{ field: "updated_at", order: "desc" }],
      pagination: {
        pageSize: +(searchParams.get("pageSize") || DEFAULT_PAGESIZE),
        current: +(searchParams.get("current") || 1),
      },
    },
  });

  const {
    getHeaderGroups,
    getRowModel,
    // refineCore: { filters, setFilters },
  } = useTable<TProject>({ columns, data: listData?.data || [] });

  // const currentFilterValues = useMemo(() => {
  //   const logicalFilter = filters.flatMap(item =>
  //     'field' in item ? item : []
  //   );
  //   return {
  //     project_name:
  //       logicalFilter.find(item => item.field === 'project_name')?.value || '',
  //   };
  // }, [filters]);

  useEffect(() => {
    localStorage.removeItem("uploaded_images");
    localStorage.removeItem("uploaded_videos");
    localStorage.removeItem("uploaded_pdf");
  }, []);

  return (
    <List
      title={
        <HStack py={2}>
          <Box>
            <FormControl
              display="flex"
              gap={2}
              alignItems="center"
              borderRightWidth="1px"
            >
              <Switch
                size={isPhone ? "sm" : "md"}
                id="isChecked"
                isChecked={
                  searchParams.get("deleted") === "true" ? true : false
                }
                onChange={() => {
                  const str = modifyParams(
                    searchParams.get("pageSize") || DEFAULT_PAGESIZE.toString(),
                    "1",
                    searchParams.get("deleted") === "true" ? "false" : "true",
                    searchParams.toString()
                  );
                  router.push(pathname + "?" + str);
                }}
              />
              <FormLabel cursor="pointer" htmlFor="isChecked" mt={2}>
                Deleted Rows
              </FormLabel>
            </FormControl>
          </Box>
          <Spinner
            display={
              projectUpdating || isListDataLoading ? "inline-block" : "none"
            }
            ml={isPhone ? 0 : 2}
          />
        </HStack>
      }
      headerButtons={userRole === "PANEL_ADMIN" ? <DeployUI /> : <></>}
      contentProps={{
        pointerEvents: projectUpdating || isListDataLoading ? "none" : "auto",
      }}
    >
      <TableContainer
        whiteSpace="pre-line"
        h={{ base: "67vh", md: "65vh" }}
        overflowY="auto"
      >
        <Table variant="simple" size="sm">
          <Thead
            sx={{
              bgColor: colorMode === "light" ? "#f1f5f9" : "#1e293b",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {getHeaderGroups()?.map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th key={header.id} py={4}>
                      {header.isPlaceholder ? null : (
                        <Flex
                          justify={
                            header.column.columnDef.header === "Actions"
                              ? "center"
                              : "start"
                          }
                        >
                          <Text textTransform="capitalize">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Text>
                        </Flex>
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        {getRowModel().rows.length === 0 ? (
          <Text
            py={10}
            textAlign="center"
            fontSize="4rem"
            fontWeight="700"
            color={colorMode === "light" ? "#e2e8f0" : "#1e293b"}
          >
            Nothing to show yet!!!
          </Text>
        ) : null}
      </TableContainer>
      <HStack justify="space-between">
        <HStack mt="4px">
          {/* <Select
            size="sm"
            onChange={(e) =>
              searchParams.get("deleted") === "true"
                ? setSearchParams({
                    pageSize: e.target.value,
                    current: "1",
                    deleted: "true",
                  })
                : setSearchParams({
                    pageSize: e.target.value,
                    current: "1",
                  })
            }
            mt="4px"
            defaultValue={searchParams.get("pageSize") || DEFAULT_PAGESIZE}
          >
            {[5, 10, 20, 50, 100].map((page) => (
              <option key={page} value={page}>
                {page} / page
              </option>
            ))}
          </Select> */}
        </HStack>
        <Pagination
          current={+(searchParams.get("current") || 1)}
          pageCount={Math.ceil(
            +(listData?.total || 0) /
              +(searchParams.get("pageSize") || DEFAULT_PAGESIZE)
          )}
          setCurrent={
            (page) => {
              const str = modifyParams(
                searchParams.get("pageSize") || DEFAULT_PAGESIZE.toString(),
                page.toString() || "1",
                searchParams.get("deleted") || "false",
                searchParams.toString()
              );
              router.push(pathname + "?" + str);
            }
            // setSearchParams({
            //   pageSize:
            //     searchParams.get("pageSize") || DEFAULT_PAGESIZE.toString(),
            //   current: page.toString() || "1",
            //   deleted: searchParams.get("deleted") || "false",
            // })
          }
        />
      </HStack>
    </List>
  );
}
