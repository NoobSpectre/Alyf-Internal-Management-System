import { Box, Button, HStack, IconButton } from '@chakra-ui/react';
import { usePagination } from '@refinedev/chakra-ui';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons';

type PaginationProps = {
  current: number;
  pageCount: number;
  setCurrent: (page: number) => void;
};

export const Pagination = ({ current, pageCount, setCurrent }: PaginationProps) => {
  const pagination = usePagination({ current, pageCount });

  return (
    <Box display="flex" justifyContent="flex-end">
      <HStack mt="3" spacing="1">
        {pagination?.prev && (
          <IconButton
            aria-label="previous page"
            onClick={() => setCurrent(current - 1)}
            disabled={!pagination?.prev}
            variant="outline"
            size="sm"
          >
            <IconChevronLeft />
          </IconButton>
        )}

        {pagination?.items.map(page => {
          if (typeof page === 'string') return <span key={page}>...</span>;

          return (
            <Button
              key={page}
              onClick={() => setCurrent(page)}
              variant={page === current ? 'solid' : 'outline'}
              size="sm"
            >
              {page}
            </Button>
          );
        })}
        {pagination?.next && (
          <IconButton
            aria-label="next page"
            onClick={() => setCurrent(current + 1)}
            variant="outline"
            size="sm"
          >
            <IconChevronRight />
          </IconButton>
        )}
      </HStack>
    </Box>
  );
};
