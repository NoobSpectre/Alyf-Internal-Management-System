"use client";

import { useSubscription } from "@/hooks";
import {
  Button,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { Octokit } from "@octokit/rest";
import { useParsed } from "@refinedev/core";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

const OWNER = "sharenestdev"; // owner of the github repository to be triggered
const REPOSITORY = "sharenest"; // github repository to be triggered

const TOKEN = process.env.REACT_APP_TOKEN_TO_RUN_WORKFLOW as string;
const LiveURL = "https://alyf.in/";
const TOTAL_STEPS = 6;

export const DeployUI = () => {
  const { resource } = useParsed();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isPhone] = useMediaQuery("(max-width: 570px)");

  const {
    startDeploying,
    deploymentSteps,
    deployment: { isDeploying, currentStage, deploymentType, deployedUrl },
  } = useSubscription();

  const triggerPreviewWorkflow = async () => {
    startDeploying();
    onOpen();

    const octokit = new Octokit({ auth: TOKEN });

    try {
      await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        {
          owner: OWNER,
          repo: REPOSITORY,
          workflow_id: "preview.yml",
          ref: "main",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            accept: "application/vnd.github+json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const triggerLiveWorkflow = async () => {
    startDeploying();
    onOpen();

    const octokit = new Octokit({ auth: TOKEN });

    try {
      await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        {
          owner: "ipaul1996",
          repo: "git-workflow-test",
          workflow_id: "live.yml",
          ref: "main",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            accept: "application/vnd.github+json",
          },
        }
      );
    } catch (error) {
      if (typeof error === "string")
        toast({
          title: "Error!",
          status: "error",
          description: error,
          duration: 2000,
        });
      else if (error && typeof error === "object" && "message" in error)
        toast({
          title: "Error!",
          status: "error",
          description: error.message as string,
          duration: 2000,
        });
      else
        toast({
          title: "Error!",
          status: "error",
          description: "An unexpected error occurred! Please try later...",
          duration: 2000,
        });
      console.log(error);
    }
  };

  return (
    <Flex gap={2}>
      <IconButton
        aria-label="create button"
        as={Link}
        size={isPhone ? "sm" : "md"}
        rounded={100}
        transition={"transform 300ms"}
        bgColor="#1da1f2"
        _hover={{ bgColor: "#1a94da", transform: "rotate(90deg)" }}
        _active={{ bgColor: "#1681bf" }}
        href={`/${resource?.name}/create` || "/"}
        isDisabled={isDeploying}
      >
        <IconPlus size="1.2rem" />
      </IconButton>

      <Menu isLazy placement="bottom">
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              size={isPhone ? "sm" : "md"}
              bgColor="#22c35e"
              _hover={{ bgColor: "#179848" }}
              _active={{ bgColor: "#0c6c33" }}
              _loading={{ bgColor: "#22c35e" }}
              isLoading={isDeploying}
              loadingText="Deploying..."
            >
              <Flex flexDir="row" justifyContent="center" gap={0.5}>
                <Text>Deploy</Text>
                <Flex alignItems="center">
                  <Icon
                    as={IconChevronDown}
                    sx={{
                      transition: "transform 500ms",
                      transform: isOpen ? "rotate(-180deg)" : "",
                    }}
                  />
                </Flex>
              </Flex>
            </MenuButton>
            <MenuList minW="fit-content" px={2} zIndex={5}>
              <MenuItem
                as={Button}
                px="1rem"
                mb={2}
                size="sm"
                variant="outline"
                onClick={triggerPreviewWorkflow}
              >
                Preview
              </MenuItem>
              <MenuItem
                as={Button}
                px="1rem"
                size="sm"
                variant="outline"
                onClick={triggerLiveWorkflow}
              >
                Live
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>

      <Modal
        size="lg"
        closeOnOverlayClick={!isDeploying}
        closeOnEsc={!isDeploying}
        isOpen={isOpen}
        // isOpen
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent gap={2}>
          <ModalHeader
            display="flex"
            alignItems="center"
            gap={2}
            sx={{ p: "1rem 1rem 0 1.5rem" }}
          >
            {isDeploying ? <Spinner /> : <ModalCloseButton />}
            <Text fontSize="large" letterSpacing={1}>
              {deploymentType
                ? currentStage === 6
                  ? `Deployed to ${deploymentType}...`
                  : `Deploying to ${deploymentType}...`
                : "Deploying..."}
            </Text>
          </ModalHeader>
          <ModalBody
            display="flex"
            flexDir="column"
            gap={2}
            sx={{ p: "0 1rem 1.5rem 1.5rem" }}
          >
            <Text>
              Step {currentStage} / {TOTAL_STEPS} :
              {deploymentSteps[currentStage]}
            </Text>
            {currentStage === 6 && (
              <Button
                as={Link}
                size="sm"
                w="fit-content"
                href={deployedUrl ? deployedUrl : LiveURL}
                target="_blank"
                bgColor="#1da1f2"
                _hover={{ bgColor: "#1a94da" }}
                _active={{ bgColor: "#1681bf" }}
              >
                {deploymentType === "preview" ? "Preview" : "Go to website"}
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
