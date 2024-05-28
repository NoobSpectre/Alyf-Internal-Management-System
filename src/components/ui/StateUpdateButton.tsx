import { IconButton, useDisclosure } from '@chakra-ui/react';
import { IconRefreshDot, IconTrash } from '@tabler/icons';
import { ConfirmationModal } from './ConfirmationModal';

export const StateUpdateButton = ({
  state,
  id,
  handleBtnClick,
}: {
  state: boolean;
  id: string;
  handleBtnClick: (locationId: string, newState: boolean) => Promise<void>;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="restore or delete btn"
        variant="outline"
        size="xs"
        colorScheme={state === true ? 'whatsapp' : 'red'}
        onClick={onOpen}
      >
        {state === true ? (
          <IconRefreshDot size="0.9rem" />
        ) : (
          <IconTrash size="0.9rem" />
        )}
      </IconButton>

      <ConfirmationModal
        isOpen={isOpen}
        onClick={async () => {
          onClose();
          await handleBtnClick(id, !state);
        }}
        onClose={onClose}
        state={true}
        isCentered
      />
    </>
  );
};
