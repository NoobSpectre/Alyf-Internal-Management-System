"use client";

import { TProject } from "@/types";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  GridItem,
  Heading,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";

type FormDrawerProps = {
  formName:
    | "investment_breakdown"
    | "other_charges"
    | "full_investment_breakdown"
    | "full_other_charges";
  drawerHeader?: string;
  isPhone: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
};

export const DynamicTable = ({
  drawerHeader,
  formName,
  isPhone,
  size = "sm",
}: FormDrawerProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<TProject>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: formName,
  });

  return (
    <>
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
          {drawerHeader}
        </Heading>

        {/* add column btn */}
        <Button
          size="sm"
          bgColor="#1da1f2"
          _active={{ transform: "scale(0.98)" }}
          _hover={{ bgColor: "#1a94da" }}
          sx={{ display: "flex", px: isPhone ? 1.5 : 3, gap: 1.5 }}
          onClick={() => append({ name: "", label: "", amount: 0 })}
        >
          <IconPlus fontSize="large" />
          {!isPhone && <Text>Add Row</Text>}
        </Button>
      </Flex>

      <Divider />

      <TableContainer as={GridItem} whiteSpace="pre-line">
        {fields.length === 0 ? (
          <Text>No data yet ❕</Text>
        ) : (
          <Table size={size} variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Label</Th>
                <Th isNumeric>Amount</Th>
                <Th textAlign="center">
                  <Tag size="sm">Actions</Tag>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {fields.map((field, idx) => {
                return (
                  <Tr key={field.id}>
                    <Td>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...register(`${formName}.${idx}.name`)}
                        />
                      </FormControl>
                    </Td>
                    <Td>
                      <FormControl>
                        <Input
                          placeholder="Label"
                          {...register(`${formName}.${idx}.label`)}
                        />
                      </FormControl>
                    </Td>
                    <Td isNumeric>
                      <FormControl>
                        <Input
                          placeholder="Amount"
                          textAlign="right"
                          {...register(`${formName}.${idx}.amount`)}
                        />
                      </FormControl>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        aria-label="delete row"
                        title="remove row"
                        onClick={() => remove(idx)}
                      >
                        <IconTrash size="1.2rem" cursor="pointer" />
                      </IconButton>
                    </Td>
                  </Tr>
                );
              })}
              {/* {fields.map((field, idx) => {
              return (
                <Tr key={field.id}>
                  <Td>
                    <FormControl>
                      <Input
                        placeholder="Label"
                        {...register(`${formName}.${idx}.name`)}
                      />
                    </FormControl>
                  </Td>
                  <Td>
                    <FormControl>
                      <Input
                        placeholder="Label"
                        {...register(`${formName}.${idx}.label`)}
                      />
                    </FormControl>
                  </Td>
                  <Td isNumeric>
                    <FormControl>
                      <Input
                        placeholder="Amount"
                        textAlign="right"
                        {...register(`${formName}.${idx}.amount`)}
                      />
                    </FormControl>
                  </Td>
                  <Td textAlign="center">
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      aria-label="delete row"
                      title="remove row"
                      onClick={() => remove(idx)}
                    >
                      <IconTrash size="1.2rem" cursor="pointer" />
                    </IconButton>
                  </Td>
                </Tr>
              );
            })} */}
            </Tbody>
          </Table>
        )}
      </TableContainer>
    </>
  );
};
