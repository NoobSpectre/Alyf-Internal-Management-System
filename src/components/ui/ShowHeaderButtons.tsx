import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  IconListDetails,
  IconPencil,
  IconRefreshDot,
  IconTrash,
} from '@tabler/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useUserRole } from 'contexts/useUserRole';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateProjectState } from 'utils/db';
import { ConfirmationModal } from './ConfirmationModal';
import { STAGE_NAMES } from './FormTitle';

type TShowHeaderButtonsProps = {
  resource: string;
  columnToMatchBy: string;
  id?: string;
  deleted?: boolean;
  keepEditMenu?: boolean;
  display?: boolean;
};

const PROJECT_STATE_STYLES = {
  false: {
    text: 'Delete',
    rightIcon: IconTrash,
    bgColor: '#ef4444',
    hover: { bgColor: '#dc2626' },
    active: { bgColor: '#b91c1c' },
  },
  true: {
    text: 'Restore',
    rightIcon: IconRefreshDot,
    bgColor: '#22c35e',
    hover: { bgColor: '#179848' },
    active: { bgColor: '#0c6c33' },
  },
};

export const ShowHeaderButtons = ({
  resource,
  id,
  columnToMatchBy,
  deleted,
  keepEditMenu = true,
  display = true,
}: TShowHeaderButtonsProps) => {
  const [projectUpdating, setProjectUpdating] = useState(false);

  const toast = useToast();
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const queryClient = useQueryClient();
  const { userRole } = useUserRole();

  const handleBtnClick = async () => {
    setProjectUpdating(true);

    await updateProjectState({
      toast,
      supabaseOptions: {
        from: resource,
        id,
        columnToMatchBy,
        newState: !deleted,
      },
    });

    queryClient.invalidateQueries({
      type: 'all',
    });

    setProjectUpdating(false);
    onClose();
  };

  return (
    <Flex
      hidden={userRole !== 'PANEL_ADMIN'}
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      {keepEditMenu ? (
        <Menu isLazy placement="bottom">
          <MenuButton
            as={Button}
            size="xs"
            rounded={2}
            colorScheme="twitter"
            rightIcon={<IconListDetails size="1rem" />}
            isDisabled={projectUpdating}
          >
            Edit
          </MenuButton>
          <MenuList minW="fit-content" px={2}>
            {Object.keys(STAGE_NAMES).map(stage => (
              <MenuItem
                as={Link}
                key={stage}
                display="flex"
                justifyContent="space-between"
                gap={5}
                color={colorMode === 'light' ? '#0284c7' : 'skyblue'}
                style={{ textDecorationLine: 'none' }}
                to={
                  stage === '1'
                    ? `/${resource}/edit/${id}`
                    : `/${resource}/edit/${id}?stage=${stage}`
                }
              >
                <Text>{STAGE_NAMES[stage as keyof typeof STAGE_NAMES]}</Text>
                <IconPencil size="1rem" />
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      ) : (
        <Button
          as={Link}
          size="xs"
          rounded={2}
          colorScheme="twitter"
          rightIcon={<IconPencil size="1rem" />}
          to={'/' + resource + '/edit/' + id}
          isDisabled={projectUpdating}
        >
          Edit
        </Button>
      )}
      {deleted === undefined ? null : (
        <Button
          size="xs"
          rounded={2}
          bgColor={PROJECT_STATE_STYLES[`${deleted}`].bgColor}
          _hover={PROJECT_STATE_STYLES[`${deleted}`].hover}
          _active={PROJECT_STATE_STYLES[`${deleted}`].active}
          _loading={PROJECT_STATE_STYLES[`${deleted}`].active}
          rightIcon={
            <Icon
              as={PROJECT_STATE_STYLES[`${deleted}`].rightIcon}
              fontSize="1rem"
            />
          }
          color={colorMode === 'light' ? '#fff' : '#000'}
          onClick={onOpen}
          isLoading={projectUpdating}
          loadingText="Please wait"
        >
          {PROJECT_STATE_STYLES[`${deleted}`].text}
        </Button>
      )}

      {/* delete property modal */}
      {/* <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="1.2rem" fontWeight="400">
              Are you sure you want to {deleted ? 'restore' : 'delete'} this
              project?
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalFooter display="flex" justifyContent="center" gap={5} pt={0}>
            <Button
              size="sm"
              colorScheme="twitter"
              onClick={handleDeleteBtnClick}
            >
              Yes
            </Button>
            <Button
              size="sm"
              bgColor={PROJECT_STATE_STYLES['false'].bgColor}
              _hover={PROJECT_STATE_STYLES['false'].hover}
              _active={PROJECT_STATE_STYLES['false'].active}
              onClick={onClose}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
      <ConfirmationModal
        isOpen={isOpen}
        onClick={handleBtnClick}
        onClose={onClose}
        state={deleted}
      />
    </Flex>
  );
};
