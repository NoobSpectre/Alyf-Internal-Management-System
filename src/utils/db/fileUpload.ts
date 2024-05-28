import { supabaseClient } from "@/lib/supabase-client";
import { TLocalStorageItems } from "@/types";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { GoConfig } from "@refinedev/core";
import { GoConfigWithResource } from "@refinedev/core/dist/hooks/router/use-go";

type TSupabaseOptions = {
  from: string;
  columnToMatch: string;
  valueToMatchBy?: string;
};

export const uploadFilesandLeave = async <T>(
  data_to_upload: T,
  go: (config: GoConfig | GoConfigWithResource) => string | void,
  toast: (options?: UseToastOptions | undefined) => ToastId,
  supabaseOptions: TSupabaseOptions,
  keyToRemove: TLocalStorageItems
) => {
  try {
    const { error } = await supabaseClient
      .from(supabaseOptions.from)
      .update({
        ...data_to_upload,
        updated_at: new Date(Date.now()).toUTCString(),
      })
      .eq(supabaseOptions.columnToMatch, supabaseOptions.valueToMatchBy);

    if (error) {
      toast({
        title: error.message,
        status: "error",
        description: error.details,
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    go({
      to: { resource: supabaseOptions.from, action: "list" },
      type: "replace",
    });

    localStorage.removeItem(keyToRemove);

    toast({
      title: "Success",
      description: "Update successful!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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

export const uploadFilesandContinue = async <T>(
  data_to_upload: T,
  go: (config: GoConfig | GoConfigWithResource) => string | void,
  toast: (options?: UseToastOptions | undefined) => ToastId,
  continueToStage: number,
  supabaseOptions: TSupabaseOptions,
  keyToRemove: TLocalStorageItems
) => {
  try {
    const { error } = await supabaseClient
      .from(supabaseOptions.from)
      .update({
        ...data_to_upload,
        updated_at: new Date(Date.now()),
      })
      .eq(supabaseOptions.columnToMatch, supabaseOptions.valueToMatchBy);

    if (error) {
      toast({
        title: error.message,
        status: "error",
        description: error.details,
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    go({
      to:
        "/" + supabaseOptions.from + "/edit/" + supabaseOptions.valueToMatchBy,
      type: "replace",
      query: { stage: continueToStage },
    });

    localStorage.removeItem(keyToRemove);

    toast({
      title: "Success",
      description: "Update successful!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
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
