"use client";

import { TDescription } from "@/types";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useFieldArray, useFormContext } from "react-hook-form";

type FormDrawerProps = {
  formName:
    | "location_description"
    | "project_description"
    | "rental_prospect_description";
  header?: string;
  isPhone: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  placement?: "top" | "right" | "bottom" | "left";
  formType?: "add" | "edit";
};

export const DynamicDescription = ({
  header,
  formName,
  isPhone,
}: FormDrawerProps) => {
  const { control, register } = useFormContext<TDescription>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${formName}.details`,
  });

  return (
    <>
      <GridItem
        display="flex"
        justifyContent="space-between"
        position="relative"
      >
        <Heading
          position="sticky"
          top="4.15rem"
          h="fit-content"
          as="h3"
          size="md"
          fontWeight="500"
        >
          {header}
        </Heading>
      </GridItem>

      <Divider as={GridItem} />

      {/* block details */}
      <VStack as={GridItem} gap={2}>
        {/* location description title */}
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder={header + " Title"}
            {...register(`${formName}.title`)}
          />
        </FormControl>

        {/* location description details */}
        {fields.map((field, idx) => {
          return (
            <FormControl key={field.id}>
              <Flex justifyContent="space-between" alignItems="center" mb={1}>
                <FormLabel>Paragraph</FormLabel>
                {/* remove detail textarea btn */}
                <Button
                  size="xs"
                  colorScheme="red"
                  sx={{ display: "flex", px: 1.5, gap: 1 }}
                  onClick={() => remove(idx)}
                >
                  <IconTrash size="1rem" />
                  {!isPhone && <Text>Remove</Text>}
                </Button>
              </Flex>
              <Textarea
                resize="vertical"
                placeholder={`${header} Detail`}
                {...register(`${formName}.details.${idx}.value`)}
              />
            </FormControl>
          );
        })}

        {/* add detail btn */}
        <Button
          size="sm"
          w="100%"
          colorScheme="twitter"
          sx={{ display: "flex", gap: 1 }}
          onClick={() => append({ value: "" })}
        >
          <IconPlus size="1rem" />
          {!isPhone && <Text>Add Paragraph</Text>}
        </Button>
      </VStack>
    </>
  );
};
