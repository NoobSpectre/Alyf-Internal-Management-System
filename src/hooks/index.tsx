// import { supabaseClient } from "@/lib/supabase-client";
import { supabaseBrowserClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type TSubscriptionPayload = {
  commit_timestamp: string | null;
  errors: string[] | null;
  eventType: "INSERT" | "UPDATE" | "DELETE" | null;
  schema: string;
  table: string;
  old: Record<string, string | string[] | number | number[] | boolean | null>;
  new:
    | {
        id: number;
        current_stage: number;
        deployment_status: "succeeded" | "failed" | "in-progress" | null;
        deployment_type: "preview" | "live";
        deploy_url: string | null;
        deploy_urls: string[] | null;
        preview_expires: string | null;
        created_at: string;
      }
    | {};
};

type TSubscriptionContext = {
  commit_timestamp: TSubscriptionPayload["commit_timestamp"];
  errors: TSubscriptionPayload["errors"];
  eventType: TSubscriptionPayload["eventType"];
  startDeploying: () => void;
  stopDeploying: () => void;
  deploymentSteps: Record<string, string>;
  deployment: {
    currentStage: number;
    deploymentStatus: "succeeded" | "failed" | "in-progress" | null;
    deploymentType: "preview" | "live" | null;
    isDeploying: boolean;
    deployedUrl: string | null;
    deployedUrls: string[] | null;
    previewExpires: string | null;
  };
};

const initSubscriptionContext: TSubscriptionContext = {
  commit_timestamp: null,
  errors: null,
  eventType: null,
  startDeploying: () => {},
  stopDeploying: () => {},
  deploymentSteps: {},
  deployment: {
    currentStage: 1,
    deployedUrl: null,
    deployedUrls: null,
    deploymentStatus: null,
    deploymentType: null,
    isDeploying: false,
    previewExpires: null,
  },
};

const SubscriptionContext = createContext<TSubscriptionContext>(
  initSubscriptionContext
);

const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [deployment, setDeployment] = useState<
    TSubscriptionContext["deployment"]
  >(initSubscriptionContext.deployment);

  const [errors, setErrors] = useState<TSubscriptionContext["errors"]>(
    initSubscriptionContext.errors
  );

  const [eventType, setEventType] = useState<TSubscriptionContext["eventType"]>(
    initSubscriptionContext.eventType
  );

  const [commit_timestamp, setCommit_timestamp] =
    useState<TSubscriptionContext["commit_timestamp"]>(null);

  const deploymentSteps: TSubscriptionContext["deploymentSteps"] = {
    "-1": "Failed to deploy the application! Please try again later",
    1: "Deployment initiated",
    2: "Syncing repository",
    3: "Preparing environment, installing dependencies",
    4: "Building application for the deployment",
    5: "Deploying to a firebase " + deployment.deploymentType + " channel",
    6: "Successfully deployed!",
  };

  const startDeploying = () =>
    setDeployment(pv => ({ ...pv, currentStage: 1, isDeploying: true }));

  const stopDeploying = useCallback(
    () => setDeployment(pv => ({ ...pv, isDeploying: false })),
    []
  );

  useEffect(() => {
    const subscriptionChannel = supabaseBrowserClient
      .channel("deployment-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "deployment_history" },
        (payload: RealtimePostgresChangesPayload<TSubscriptionPayload>) => {
          setEventType(payload.eventType);
          setErrors(payload.errors);
          setCommit_timestamp(payload.commit_timestamp);

          if (
            "current_stage" in payload.new &&
            "deployment_status" in payload.new &&
            "deploy_url" in payload.new &&
            "deploy_urls" in payload.new &&
            "deployment_type" in payload.new &&
            "preview_expires" in payload.new
          )
            setDeployment({
              isDeploying:
                (payload.new
                  .deployment_status as TSubscriptionContext["deployment"]["deploymentStatus"]) ===
                "in-progress",
              currentStage: payload.new
                .current_stage as TSubscriptionContext["deployment"]["currentStage"],
              deploymentStatus: payload.new
                .deployment_status as TSubscriptionContext["deployment"]["deploymentStatus"],
              deployedUrl: payload.new
                .deploy_url as TSubscriptionContext["deployment"]["deployedUrl"],
              deployedUrls: payload.new
                .deploy_urls as TSubscriptionContext["deployment"]["deployedUrls"],
              deploymentType: payload.new
                .deployment_type as TSubscriptionContext["deployment"]["deploymentType"],
              previewExpires: payload.new
                .preview_expires as TSubscriptionContext["deployment"]["previewExpires"],
            });
        }
      )
      .subscribe();

    return () => {
      const removeSubscription = async () =>
        await supabaseBrowserClient.removeChannel(subscriptionChannel);

      removeSubscription();
    };
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        deployment,
        errors,
        eventType,
        commit_timestamp,
        startDeploying,
        stopDeploying,
        deploymentSteps,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);

  if (!ctx) throw new Error("Scope out of Subscription Context Provider!");

  return ctx;
};

export default SubscriptionProvider;
