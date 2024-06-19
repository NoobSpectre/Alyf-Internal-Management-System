"use client";

import { supabaseBrowserClient } from "@/utils/supabase/client";
import { AuthProvider } from "@refinedev/core";
// import Cookies from "js-cookie";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {

    // previous react project code 


    // const { data, error } = await supabaseClient.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    const { data, error } = await supabaseBrowserClient.auth.signInWithPassword(
      {
        email,
        password,
      },
    );
    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.session) {

      // previous react project code 

      // Cookies.set("token", data.session.access_token, {
        //   expires: 30, // 30 days
        //   path: "/",
        // });
        
      supabaseBrowserClient.auth.setSession(data.session);
      return {
        success: true,
        redirectTo: "/",
      };
    }

    // for third-party login
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {

    // previous react project code 

    // Cookies.remove("token", { path: "/" });
    // const { error } = await supabaseClient.auth.signOut();

    // new code to resolve auth-flow bug
    const { error } = await supabaseBrowserClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password }) => {
    try {

      // previous react project code 

      // const { data, error } = await supabaseClient.auth.signUp({
      //   email,
      //   password,
      // });

      // new code to resolve auth-flow bug
      const { data, error } = await supabaseBrowserClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },
  check: async () => {

    // pevious react project code 

    // const token = Cookies.get("token");
    // const { data } = await supabaseClient.auth.getUser(token);
    // const { user } = data;

    // if (user) {
    //   return {
    //     authenticated: true,
    //   };
    // }

    // return {
    //   authenticated: false,
    //   redirectTo: "/login",
    // };

    // new code to resolve auth-flow bug
    const { data, error } = await supabaseBrowserClient.auth.getSession();
    const { session } = data;

    if (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
      };
    }

    if (session) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    //previous code of react-project
    // const user = await supabaseClient.auth.getUser();

    // new code to resolve auth-flow bug
    const user = await supabaseBrowserClient.auth.getUser();

    if (user) {
      return user.data.user?.role;
    }

    return null;
  },
  getIdentity: async () => {
    //previous react-project code
    // const { data } = await supabaseClient.auth.getUser();

    // new code to resolve auth-flow bug
    const { data } = await supabaseBrowserClient.auth.getUser();
    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },
  onError: async error => {
    if (error?.code === "PGRST301" || error?.code === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
