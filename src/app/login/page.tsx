import { AuthPage } from "@components/auth-page";
import { authProviderServer } from "@providers/auth-provider";
import { redirect } from "next/navigation";
import { LoginTitle } from "./LoginTitle";

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return (
    <AuthPage
      forgotPasswordLink={false}
      registerLink={false}
      rememberMe={null}
      type="login"
      title={<LoginTitle />}
      formProps={{
        defaultValues: {
          email: process.env.NEXT_PUBLIC_ADMIN_EMAIL_ID as string,
          password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string,
        },
      }}
    />
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
