"use client";

import { DeployUI, Pagination, StateUpdateButton } from "@/components/ui";
import { useUserRole } from "@/hooks/useUserRole";
import modifyParams from "@/lib/functions/modifyParams";
import { TLocation } from "@/types";
import { updateProjectState } from "@/utils/db";
import { getTimeandDate } from "@/utils/fn";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Spinner,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { EditButton, List, ShowButton } from "@refinedev/chakra-ui";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const RESOURCE = "locations"; // update to -> locations
const COLUMN_TO_MATCH_BY = 'location_id';
const DEFAULT_PAGESIZE = 10;

const LocationList = () => {
  const [projectUpdating, setProjectUpdating] = useState(false);

  const toast = useToast();
  const { colorMode } = useColorMode();
  const [isPhone] = useMediaQuery("(max-width: 570px)");
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { userRole } = useUserRole();

  // const filterInputRef = useRef<HTMLInputElement | null>(null);

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

  const columns = useMemo<ColumnDef<TLocation>[]>(
    () => [
      // {
      //   id: 'location_id',
      //   header: 'Location Id',
      //   accessorKey: 'location_id',
      //   cell: ({ getValue }) => {
      //     return (
      //       <Text maxW="4.2rem" noOfLines={1}>
      //         {getValue() as string}
      //       </Text>
      //     );
      //   },
      // },
      {
        id: "location_name",
        accessorKey: "location_name",
        header: "Location Name",
      },
      {
        id: "display_location",
        accessorKey: "display_location",
        header: "Display Location",
        cell: ({ getValue }) => {
          const display_location = getValue() as string;
          return <span>{display_location ?? "N/A"}</span>;
        },
      },
      {
        id: "state",
        accessorKey: "state",
        header: "State",
      },
      {
        id: "country",
        accessorKey: "country",
        header: "Country",
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Created At",
        cell: function render({ getValue }) {
          return (
            <span
              style={{
                display: "block", // Ensure single-line display
                whiteSpace: "nowrap", // Prevent text wrapping
                overflow: "hidden", // Hide overflow
                textOverflow: "ellipsis", // Add ellipsis
              }}
            >
              {getTimeandDate(getValue() as string)}
            </span>
          );
        },
      },
      {
        id: "updated_at",
        accessorKey: "updated_at",
        header: "Updated At",
        cell: ({ row, getValue }) => {
          const UpdatedAt = row.original.updated_at;
          return (
            <span
              style={{
                display: "block", // Ensure single-line display
                whiteSpace: "nowrap", // Prevent text wrapping
                overflow: "hidden", // Hide overflow
                textOverflow: "ellipsis", // Add ellipsis
              }}
            >
              {UpdatedAt ? getTimeandDate(UpdatedAt, true) : "N/A"}
            </span>
          );
        },
      },
      // {
      //   id: "seasons",
      //   accessorKey: "seasons",
      //   header: "Seasons",
      //   cell: ({ getValue }) => {
      //     return (
      //       <span>
      //         {getValue() ? (
      //           <IconButton
      //             isRound
      //             size="sm"
      //             aria-label="Data available"
      //             icon={<IconCheck />}
      //           />
      //         ) : (
      //           <IconButton
      //             isRound
      //             size="sm"
      //             mx="auto"
      //             aria-label="data-unavailable"
      //             icon={<IconMinus />}
      //           />
      //         )}
      //       </span>
      //     );
      //   },
      // },
      // {
      //   id: "special_days_calender",
      //   accessorKey: "special_days_calender",
      //   header: "Special Days Calender",
      //   cell: ({ getValue }) => {
      //     return (
      //       <span>
      //         {getValue() ? (
      //           <IconButton
      //             isRound
      //             size="sm"
      //             aria-label="Data available"
      //             icon={<IconCheck />}
      //           />
      //         ) : (
      //           <IconButton
      //             isRound
      //             size="sm"
      //             mx="auto"
      //             aria-label="data-unavailable"
      //             icon={<IconMinus />}
      //           />
      //         )}
      //       </span>
      //     );
      //   },
      // },
      {
        id: "actions",
        accessorKey: "location_id",
        header: "Actions",
        cell: ({ getValue, row }) => {
          return (
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
                  <EditButton
                    hideText
                    recordItemId={getValue() as string}
                    size="xs"
                    colorScheme="messenger"
                    svgIconProps={{ size: "0.9rem" }}
                  />
                  <StateUpdateButton
                    state={row.original.deleted}
                    id={getValue() as string}
                    handleBtnClick={handleBtnClick}
                  />
                </>
              ) : null}
            </HStack>
          );
        },
      },
    ],
    [handleBtnClick, userRole]
  );

  const { data: listData, isLoading: isListDataLoading } = useList<TLocation>({
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
    // refineCore: { setCurrent, pageCount, current, setPageSize, pageSize },
  } = useTable<TLocation>({ columns, data: listData?.data || [] });

  // implement filter
  // const currentFilterValues = useMemo(() => {
  //   const logicalFilter = filters.flatMap(item =>
  //     'field' in item ? item : []
  //   );
  //   return {
  //     location_name:
  //       logicalFilter.find(item => item.field === 'location_name')?.value || '',
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
          {/* <Popover
            initialFocusRef={filterInputRef}
            closeOnBlur={filterInputRef.current?.value === ''}
            closeOnEsc={filterInputRef.current?.value === ''}
          >
            <PopoverContent
              maxWidth="10rem"
              position="relative"
              left="7rem"
              top="-3rem"
            >
              <Input
                ref={filterInputRef}
                value={currentFilterValues.location_name}
                placeholder="Search Location"
                onChange={e => {
                  setFilters([
                    {
                      field: 'location_name',
                      operator: 'contains',
                      value: !!e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                  ]);
                }}
              />
            </PopoverContent>
            <PopoverTrigger>
              <IconButton aria-label="filter button">
                <IconSearch />
              </IconButton>
            </PopoverTrigger>
          </Popover> */}
        </HStack>
      }
      breadcrumb={null}
      headerButtons={userRole === "PANEL_ADMIN" ? <DeployUI /> : <></>}
      contentProps={{
        pointerEvents: projectUpdating || isListDataLoading ? "none" : "auto",
      }}
    >
      <TableContainer
        whiteSpace="pre-line"
        h={{ base: "67vh", md: "69vh" }}
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
            {getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
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
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
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
            onChange={e =>
              searchParams.get("deleted") === "true"
                ? setSearchParams({
                    pageSize: e.target.value,
                    current: "1",
                    deleted: searchParams.get("deleted") || "false",
                  })
                : setSearchParams({ pageSize: e.target.value, current: "1" })
            }
            mt="4px"
            defaultValue={searchParams.get("pageSize") || DEFAULT_PAGESIZE}
          >
            {[5, 10, 20, 50, 100].map(page => (
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
          setCurrent={page => {
            const str = modifyParams(
              searchParams.get("pageSize") || DEFAULT_PAGESIZE.toString(),
              page.toString() || "1",
              searchParams.get("deleted") || "false",
              searchParams.toString()
            );
            router.push(pathname + "?" + str);
          }}
        />
      </HStack>
    </List>
  );
};

export default LocationList;
