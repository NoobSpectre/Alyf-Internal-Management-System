"use client";

import { TConfig } from "@/types";
import {
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  Heading,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  useToast,
} from "@chakra-ui/react";
import { uuid } from "@supabase/supabase-js/dist/module/lib/helpers";
import { IconPlus } from "@tabler/icons-react";
import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

type TConfigFieldProps = {
  formName:
    | "tags"
    | "property_types"
    | "available_buy_options"
    | "bhk_configurations"
    | "categories";
  fieldHeader: string;
  field: string;
  isPhone: boolean;
  placeholder?: string;
  fieldInputType?: "text" | "number";
};

export const ConfigField = ({
  formName,
  fieldHeader,
  isPhone,
  field,
  placeholder,
  fieldInputType = "text",
}: TConfigFieldProps) => {
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const { control } = useFormContext<Omit<TConfig, "amenities" | "features">>();

  const { fields, append, remove } = useFieldArray({ control, name: formName });

  const addFieldValue = () => {
    if (inputFieldRef.current === null) return;
    const inputValue = inputFieldRef.current.value;

    if (inputValue === "") return;

    if (formName === "bhk_configurations") {
      if (+inputValue <= 0) {
        toast({
          title: "Error!",
          description: `'${inputValue}' ${field} is invalid!`,
          duration: 2000,
          status: "error",
          isClosable: true,
        });
        return;
      } else if (
        fields.filter(f => f.value === inputValue + " BHK").length !== 0
      ) {
        toast({
          title: "Error!",
          description: `'${inputValue}' ${field} already exists!`,
          duration: 2000,
          status: "error",
          isClosable: true,
        });
        return;
      }
    } else if (
      fields.filter(f => f.value === inputValue.toLowerCase()).length !== 0
    ) {
      toast({
        title: "Error!",
        description: `'${inputValue}' ${field} already exists!`,
        duration: 2000,
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (formName === "bhk_configurations")
      append({
        id: uuid(),
        label: inputValue + " BHK",
        value: inputValue + " BHK",
      });
    else
      append({
        id: uuid(),
        label: inputValue,
        value: inputValue.toLowerCase(),
      });

    inputFieldRef.current.value = "";
    inputFieldRef.current.focus();
  };

  return (
    <>
      <GridItem
        as={Flex}
        position="relative"
        justifyContent="space-between"
        alignItems="end"
        gap={4}
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
          {fieldHeader}
        </Heading>

        {/* add field value btn */}
        <Flex role="group">
          <Input
            type={fieldInputType}
            placeholder={placeholder || "Add " + fieldHeader.slice(0, -1)}
            ref={inputFieldRef}
            size="sm"
            rounded={0}
            roundedLeft={5}
          />
          <Button
            size="sm"
            rounded={0}
            roundedRight={5}
            bgColor="#1da1f2"
            _active={{ bgColor: "#1681bf" }}
            _hover={{ bgColor: "#1a94da" }}
            sx={{ display: "flex", px: isPhone ? 1.5 : 3, gap: 1.5 }}
            onClick={addFieldValue}
          >
            <Box
              transition={"transform 300ms ease-out"}
              _groupHover={{ transform: "rotate(90deg)" }}
            >
              <IconPlus fontSize="large" />
            </Box>
          </Button>
        </Flex>
      </GridItem>

      <GridItem as={Divider} />

      <GridItem as={Flex} flexWrap="wrap" gap={2}>
        {fields.map((field, index) => (
          <Tag borderRadius="full" size="lg" key={field.id}>
            <TagLabel>{field.label}</TagLabel>
            <TagCloseButton onClick={() => remove(index)} />
          </Tag>
        ))}
      </GridItem>
    </>
  );
};
