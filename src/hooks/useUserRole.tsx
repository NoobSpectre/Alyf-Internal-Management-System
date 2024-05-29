import { TUserRoles } from "@/types";
import { getUserRole } from "@/utils/db/userData";
import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<TUserRoles | null>(null);

  const toast = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { role, error } = await getUserRole();

        if (error) {
          setUserRole(null);

          toast({
            title: error.name,
            description: error.message,
            status: "error",
            duration: 2 * 1000,
            isClosable: true,
          });
          return;
        }

        setUserRole(role);
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

    fetchUserRole();
  }, [toast]);

  return { userRole };
};
