// import { supabaseClient } from "@/lib/supabase-client";
import { ToastId, UseToastOptions } from "@chakra-ui/toast";
import { GoConfig } from "@refinedev/core";
import { GoConfigWithResource } from "@refinedev/core/dist/hooks/router/use-go";
import { supabaseBrowserClient } from "../supabase/client";

type TSupabaseOptions = {
  from: string;
  columnToMatch: string;
  valueToMatchBy?: string;
};

export const saveAndContinue = async <T>(
  data_to_upload: T,
  go: (config: GoConfig | GoConfigWithResource) => string | void,
  toast: (options?: UseToastOptions | undefined) => ToastId,
  continueToStage: number,
  supabaseOptions: TSupabaseOptions
) => {
  try {
    const { error } = await supabaseBrowserClient
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
        description: "An unexpected error occurred! Please try later...",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }
};
