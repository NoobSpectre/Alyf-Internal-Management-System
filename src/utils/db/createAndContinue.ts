// import { supabaseClient } from "@/lib/supabase-client";
import { ToastId, UseToastOptions } from "@chakra-ui/react";
import { GoConfig } from "@refinedev/core";
import { GoConfigWithResource } from "@refinedev/core/dist/hooks/router/use-go";
import { supabaseBrowserClient } from "../supabase/client";

export const createAndContinue = async <T>(
  data_to_upload: T,
  go: (config: GoConfig | GoConfigWithResource) => string | void,
  toast: (options?: UseToastOptions | undefined) => ToastId,
  continueToStage: number,
  supabaseOptions: { from: string }
) => {
  try {
    const { data: dbData, error } = await supabaseBrowserClient
      .from(supabaseOptions.from)
      .insert({
        ...data_to_upload,
        updated_at: new Date(Date.now()),
      })
      .select("project_id");

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
      to: "/" + supabaseOptions.from + "/edit/" + dbData[0].project_id,
      type: "replace",
      query: { stage: continueToStage },
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
