import { ToastId, UseToastOptions } from '@chakra-ui/toast';
import { supabaseClient } from '@/lib/supabase-client';

type TDeleteProjectProps = {
  toast: (options?: UseToastOptions | undefined) => ToastId;
  supabaseOptions: {
    id?: string;
    from: string;
    columnToMatchBy: string;
    newState: boolean;
  };
};

export const updateProjectState = async ({
  toast,
  supabaseOptions: { id, from, columnToMatchBy, newState },
}: TDeleteProjectProps) => {
  try {
    const { error } = await supabaseClient
      .from(from)
      .update({
        deleted: newState,
        updated_at: new Date(Date.now()),
      })
      .eq(columnToMatchBy, id);

    if (error) {
      toast({
        title: error.message,
        status: 'error',
        description: error.details,
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Success',
      description:
        newState === true ? 'Property removed!' : 'Property restored!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  } catch (error) {
    if (typeof error === 'string') {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } else if (error && typeof error === 'object' && 'message' in error) {
      toast({
        title: 'Error',
        description: error.message as string,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: 'An Unexpected Error occured!',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }

    console.log(error);
  }
};
