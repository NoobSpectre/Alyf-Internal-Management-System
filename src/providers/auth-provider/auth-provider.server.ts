import { AuthBindings } from "@refinedev/core";
import { createSupabaseServerClient } from "@/utils/supabase/server";


export const authProviderServer: Pick<AuthBindings, "check"> = {

  // previous  code which was used in react code


  // check: async () => {
  //   const cookieStore = cookies();
  //   const auth = cookieStore.get("token");

  //   if (auth) {
  //     return {
  //       authenticated: true,
  //     };
  //   }

  //   return {
  //     authenticated: false,
  //     logout: true,
  //     redirectTo: "/login",
  //   };
  // },


  // new code to resolve auth flow bug
  check: async () => {
    const { data, error } =
      await createSupabaseServerClient().auth.getSession();
    const { session } = data;

    if (error) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }

    if (session) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
};
