// import { supabaseClient } from "@/lib/supabase-client";
import { TLocalStorageItems } from "@/types";
import { ToastId, UseToastOptions } from "@chakra-ui/toast";
import { supabaseBrowserClient } from "../supabase/client";

const BUCKET = process.env.REACT_APP_STORAGE_BUCKET as string;

type TRemoveOptions = {
  filesToRemove: string[];
  toast: (options?: UseToastOptions | undefined) => ToastId;
  keyToRemove: TLocalStorageItems;
};

export const removeFromBucket = async ({
  filesToRemove,
  toast,
  keyToRemove,
}: TRemoveOptions) => {
  if (filesToRemove.length === 0) {
    localStorage.removeItem(keyToRemove);
    return;
  }

  try {
    const { error } = await supabaseBrowserClient.storage
      .from(BUCKET)
      .remove(filesToRemove);

    if (error) {
      toast({
        title: error.name,
        status: "error",
        description: error.message,
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    localStorage.removeItem(keyToRemove);
  } catch (error) {
    if (typeof error === "string") {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else if (error && typeof error === "object" && "message" in error) {
      toast({
        title: "Error",
        description: error.message as string,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "An Unexpected Error occured!",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    console.log(error);
  }
};
