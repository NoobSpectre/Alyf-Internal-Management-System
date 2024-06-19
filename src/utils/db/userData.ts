// previously used in react project
// import { supabaseClient } from "@/lib/supabase-client";
import { TUserRoles } from "@/types";
import { supabaseBrowserClient } from "../supabase/client";

export const getUserRole = async () => {
  const { data, error } = await supabaseBrowserClient.auth.getUser();

  if (error) {
    console.log(error);
    return { role: null, error: error };
  }
  const role = data.user.app_metadata.app_roles.admin_panel_app as TUserRoles;

  return { role, error };
};
