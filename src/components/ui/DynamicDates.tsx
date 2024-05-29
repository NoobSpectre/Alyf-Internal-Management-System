import { TDateRange, TLocation } from "@/types";
import { getFormattedHeading, getMonthName } from "@/utils/fn";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

type TDynamicDatesProps = {
  formName: "seasons" | "special_days_calender";
  formInput: string;
  header: string | null;
  isPhone: boolean;
};

const GRID_TEMPLATE_COLS = "0.6fr 5px 1fr";
const GAP_BETWEEN_LABEL_AND_INPUT = "1rem";

const TABLE_DATA = {
  seasons: ["start_date", "end_date"],
  special_days_calender: ["name", "start_date", "end_date"],
};

export const DynamicDates = ({
  formName,
  formInput,
  header,
  isPhone,
}: TDynamicDatesProps) => {
  const [dateRange, setDateRange] = useState<TDateRange>({
    start_date: { day: 1, month: 1 },
    end_date: { day: 1, month: 1 },
  });

  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const nameInputRef = useRef<HTMLInputElement>(null);

  const { control, getValues, setValue, register } =
    useFormContext<TLocation>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${formName}.${formInput}`,
  });

  const removeField = (
    where: "seasons" | "special_days_calender",
    formInput: string
  ) => {
    const _v = getValues(where);

    const { [formInput]: _, ...newValue } = _v;
    setValue(where, newValue);
  };

  const handleDateSave = () => {
    const { start_date, end_date } = dateRange;

    if (
      start_date.month > end_date.month ||
      (start_date.month === end_date.month && start_date.day > end_date.day)
    ) {
      toast({
        description: "Start Date can't be greater than End Date!",
        status: "error",
        title: "Error!",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (
      formName === "special_days_calender" &&
      nameInputRef.current?.value === ""
    ) {
      toast({
        description: "Name is not provided!",
        status: "error",
        title: "Error!",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const newValue = { name: nameInputRef.current?.value, ...dateRange };

    if (formName === "seasons") append(dateRange);
    else if (formName === "special_days_calender") append(newValue);

    onClose();
  };

  return (
    <GridItem as={Grid} gridTemplateColumns={GRID_TEMPLATE_COLS} gap={2}>
      {/* block title */}
      <GridItem colSpan={isPhone ? 3 : 1} position="relative">
        <Flex
          position="sticky"
          top="7.2rem"
          h="fit-content"
          gap={5}
          justify="space-between"
        >
          <Heading as="h4" size="sm" fontWeight="400">
            {header || getFormattedHeading(formName)}
          </Heading>

          <Popover placement="left">
            {({ onClose }) => (
              <>
                <PopoverTrigger>
                  <IconButton
                    colorScheme="red"
                    size="xs"
                    aria-label="delete season"
                  >
                    <IconTrash size="0.9rem" />
                  </IconButton>
                </PopoverTrigger>
                <PopoverContent maxW={40}>
                  <PopoverArrow />
                  <PopoverBody textAlign="center">Are you sure?</PopoverBody>
                  <PopoverFooter display="flex" justifyContent="center" gap={3}>
                    <Button
                      size="xs"
                      colorScheme="twitter"
                      onClick={() => removeField(formName, formInput)}
                    >
                      Yes
                    </Button>
                    <Button size="xs" colorScheme="red" onClick={onClose}>
                      No
                    </Button>
                  </PopoverFooter>
                </PopoverContent>
              </>
            )}
          </Popover>
        </Flex>
      </GridItem>

      <GridItem
        as={Divider}
        orientation={isPhone ? "horizontal" : "vertical"}
        colSpan={isPhone ? 3 : 1}
      />

      <GridItem
        as={TableContainer}
        whiteSpace="pre-line"
        colSpan={isPhone ? 3 : 1}
      >
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              {TABLE_DATA[formName].map(h => (
                <Th key={h}>{h}</Th>
              ))}
              <Th isNumeric>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {fields.map((f, idx) => {
              return (
                <Tr key={f.id}>
                  {"name" in f ? <Td>{f.name as string}</Td> : null}
                  <Td>
                    {f.start_date.day} {getMonthName(f.start_date.month)}
                  </Td>
                  <Td>
                    {f.end_date.day} {getMonthName(f.end_date.month)}
                  </Td>
                  <Td isNumeric>
                    <IconButton
                      size="xs"
                      colorScheme="red"
                      aria-label="delete row"
                      title="remove row"
                      onClick={() => remove(idx)}
                    >
                      <IconTrash size="1rem" cursor="pointer" />
                    </IconButton>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        {/* add row btn */}
        <Box py={1} px={4}>
          <Button
            size="sm"
            w="100%"
            rounded={3}
            bgColor="#1da1f2"
            _hover={{ bgColor: "#1a94da" }}
            _active={{ bgColor: "#1681bf" }}
            onClick={onOpen}
          >
            Add
          </Button>
        </Box>
      </GridItem>

      <Modal
        size="lg"
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {formName}&nbsp;({formInput})
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            {formName === "special_days_calender" ? (
              <Flex flexDir="column" gap={4} mb={5}>
                <FormControl isRequired>
                  <FormLabel>Add Name</FormLabel>
                  <Input ref={nameInputRef} placeholder="Add Name" />
                </FormControl>
              </Flex>
            ) : null}
            <Flex flexDir="column">
              <FormLabel>Add Date Range</FormLabel>
              <Flex justify="space-between" alignItems="center">
                {/* start date */}
                <Flex gap={2}>
                  {/* day */}
                  <FormControl>
                    <FormLabel>Day</FormLabel>
                    <Select
                      value={dateRange.start_date.day}
                      onChange={e =>
                        setDateRange(pv => ({
                          ...pv,
                          start_date: {
                            day: +e.target.value,
                            month: pv.start_date.month,
                          },
                        }))
                      }
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  {/* month */}
                  <FormControl>
                    <FormLabel>Month</FormLabel>
                    <Select
                      value={dateRange.start_date.month}
                      onChange={e =>
                        setDateRange(pv => ({
                          ...pv,
                          start_date: {
                            day: pv.start_date.day,
                            month: +e.target.value,
                          },
                        }))
                      }
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        month => (
                          <option key={month} value={month}>
                            {getMonthName(month).slice(0, 3)}
                          </option>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Flex>

                <Divider border="1px solid" maxW="1rem" />

                {/* end date */}
                <Flex gap={2}>
                  {/* day */}
                  <FormControl>
                    <FormLabel>Day</FormLabel>
                    <Select
                      value={dateRange.end_date.day}
                      onChange={e =>
                        setDateRange(pv => ({
                          ...pv,
                          end_date: {
                            day: +e.target.value,
                            month: pv.end_date.month,
                          },
                        }))
                      }
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  {/* month */}
                  <FormControl>
                    <FormLabel>Month</FormLabel>
                    <Select
                      value={dateRange.end_date.month}
                      onChange={e =>
                        setDateRange(pv => ({
                          ...pv,
                          end_date: {
                            day: pv.end_date.day,
                            month: +e.target.value,
                          },
                        }))
                      }
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        month => (
                          <option key={month} value={month}>
                            {getMonthName(month).slice(0, 3)}
                          </option>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              size="sm"
              colorScheme="blue"
              mr={3}
              onClick={handleDateSave}
            >
              Add
            </Button>
            <Button size="sm" colorScheme="red" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </GridItem>
  );
};
