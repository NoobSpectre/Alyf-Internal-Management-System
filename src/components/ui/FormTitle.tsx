import { TProject } from "@/types";
import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useGo, useParsed } from "@refinedev/core";
import { IconArrowRight, IconChevronDown } from "@tabler/icons-react";
import { MouseEventHandler, useState } from "react";
import { SubmitHandler } from "react-hook-form";

type TFormStage = "1" | "2" | "3" | "4" | "5" | "6";

type TFormTitleProps = {
  property?: string;
  stage?: TFormStage;
  onClick?: (stageToGo?: string) => SubmitHandler<TProject>;
  handleSubmit?: MouseEventHandler;
  keepEditMenu?: boolean;
};

export const STAGE_NAMES = {
  "1": "Basic Info",
  "2": "Description",
  "3": "Pricing",
  "4": "Image",
  "5": "Video",
  "6": "Brochure",
};

export const FormTitle = ({
  property,
  stage,
  onClick,
  handleSubmit,
  keepEditMenu = true,
}: TFormTitleProps) => {
  const { params, action, resource, id } = useParsed<{ stage: string }>();
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const go = useGo();

  const [formStage] = useState(stage || params?.stage || "1");
  // const [formDestStage, setFormDestStage] = useState(formStage);

  const menuStageNamesList = Object.keys(STAGE_NAMES).filter(
    stage => stage !== formStage
  );

  // const goWithSaving = (continueToStage: string) => {
  //   let saveAndGo: SubmitHandler<TProject>;
  //   if (onClick) saveAndGo = onClick(continueToStage);

  //   // if (handleSubmit) handleSubmit(saveAndGo)

  //   onClose();
  // };

  const goWithoutSaving = (stage?: string) => {
    localStorage.removeItem("uploaded_images");
    localStorage.removeItem("uploaded_videos");
    localStorage.removeItem("uploaded_pdf");

    if (stage)
      go({
        to: `/${resource?.name}/edit/${id}?stage=${stage}`,
        type: "replace",
      });
    else
      go({
        to: `/${resource?.name}/edit/${id}`,
        type: "replace",
      });
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          {action !== "create" ? (
            <Badge colorScheme="whatsapp">{property}</Badge>
          ) : (
            <Text>Create</Text>
          )}
        </BreadcrumbItem>
        {action !== "show" && keepEditMenu === true && (
          <BreadcrumbItem>
            {action === "edit" ? (
              <Menu isLazy placement="bottom">
                <MenuButton
                  as={Badge}
                  colorScheme="whatsapp"
                  cursor="pointer"
                  tabIndex={0}
                >
                  <Flex flexDir="row" justifyContent="center" gap={0.5}>
                    <Text>
                      {STAGE_NAMES[formStage as keyof typeof STAGE_NAMES]}
                    </Text>
                    <Box>
                      <Icon as={IconChevronDown} />
                    </Box>
                  </Flex>
                </MenuButton>
                <MenuList minW="fit-content" px={2}>
                  {menuStageNamesList.map(stage => (
                    <MenuItem
                      key={stage}
                      display="flex"
                      justifyContent="space-between"
                      gap={5}
                      style={{ textDecorationLine: "none" }}
                      onClick={() => goWithoutSaving(stage)}
                    >
                      <Text>
                        {STAGE_NAMES[stage as keyof typeof STAGE_NAMES]}
                      </Text>
                      <Icon as={IconArrowRight} fontSize="0.8rem" />
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <Badge colorScheme="whatsapp">
                {STAGE_NAMES[formStage as keyof typeof STAGE_NAMES]}
              </Badge>
            )}
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      {/* <Modal size="xs" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py={1}>
            {STAGE_NAMES[formDestStage as keyof typeof STAGE_NAMES]}
          </ModalHeader>
          <ModalCloseButton size="sm" />

          <ModalBody py={0}>Are you sure?</ModalBody>

          <ModalFooter gap={2} pt={0} pb={2}>
            <Button
              size="xs"
              type="submit"
              colorScheme="blue"
              onClick={() => goWithSaving(formDestStage)}
              style={{ textDecorationLine: 'none' }}
            >
              Save
            </Button>
            <Button
              // as={Link}
              size="xs"
              colorScheme="red"
              style={{ textDecorationLine: 'none' }}
              // to={
              //   formDestStage === '1'
              //     ? `/${resource?.name}/edit/${id}`
              //     : `/${resource?.name}/edit/${id}?stage=${formDestStage}`
              // }
              // replace
              onClick={() =>
                formDestStage === '1'
                  ? goWithoutSaving()
                  : goWithoutSaving(formDestStage)
              }
            >
              Don't Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
    </>
  );
};
