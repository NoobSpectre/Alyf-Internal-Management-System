"use client";
import { useColorMode } from "@chakra-ui/color-mode";
import { useMediaQuery } from "@chakra-ui/media-query";
import { useOne } from "@refinedev/core";
import {
  Stage1,
  Stage2,
  Stage3,
  Stage4,
  Stage5,
  Stage6,
} from "@/components/stages";
import { Unauthorize } from "@/components/ui";
import { useUserRole } from "@/hooks/useUserRole";
import { useParams, useSearchParams } from "next/navigation";
import { TProject } from "@/types";
import { Create } from "@/components/crud";

const GRID_TEMPLATE_COLS = "0.6fr 5px 1fr";
const GAP_BETWEEN_LABEL_AND_INPUT = "1rem";
const PROJECTS_TABLE = "projects";

const ProjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { colorMode } = useColorMode();
  const [isPhone] = useMediaQuery("(max-width: 570px)");

  const { userRole } = useUserRole();

  const { data: projectData, isLoading: isProjectDataLoading } =
    useOne<TProject>({
      resource: PROJECTS_TABLE,
      id,
      queryOptions: { refetchOnMount: "always" },
    });

  const renderStage = (stage: string | null) => {
    switch (stage) {
      case "2":
        return (
          <Stage2
            id={id}
            resource={PROJECTS_TABLE}
            colorMode={colorMode}
            isPhone={isPhone}
            gap_between_label_and_input={GAP_BETWEEN_LABEL_AND_INPUT}
            grid_template_cols={GRID_TEMPLATE_COLS}
            isProjectDataLoading={isProjectDataLoading}
            projectData={projectData?.data}
          />
        );
      case "3":
        return (
          <Stage3
            id={id}
            resource={PROJECTS_TABLE}
            colorMode={colorMode}
            isPhone={isPhone}
            gap_between_label_and_input={GAP_BETWEEN_LABEL_AND_INPUT}
            grid_template_cols={GRID_TEMPLATE_COLS}
            isProjectDataLoading={isProjectDataLoading}
            projectData={projectData?.data}
          />
        );
      case "4":
        return (
          <Stage4
            id={id}
            resource={PROJECTS_TABLE}
            colorMode={colorMode}
            isPhone={isPhone}
            gap_between_label_and_input={GAP_BETWEEN_LABEL_AND_INPUT}
            grid_template_cols={GRID_TEMPLATE_COLS}
            isProjectDataLoading={isProjectDataLoading}
            projectData={projectData?.data}
          />
        );
      case "5":
        return (
          <Stage5
            id={id}
            resource={PROJECTS_TABLE}
            colorMode={colorMode}
            isPhone={isPhone}
            gap_between_label_and_input={GAP_BETWEEN_LABEL_AND_INPUT}
            grid_template_cols={GRID_TEMPLATE_COLS}
            isProjectDataLoading={isProjectDataLoading}
            projectData={projectData?.data}
          />
        );
      case "6":
        return (
          <Stage6
            id={id}
            resource={PROJECTS_TABLE}
            colorMode={colorMode}
            isPhone={isPhone}
            gap_between_label_and_input={GAP_BETWEEN_LABEL_AND_INPUT}
            grid_template_cols={GRID_TEMPLATE_COLS}
            isProjectDataLoading={isProjectDataLoading}
            projectData={projectData?.data}
          />
        );
      case "1":
      case null:
        return (
          <Stage1
            id={id}
            resource={PROJECTS_TABLE}
            colorMode={colorMode}
            isPhone={isPhone}
            gap_between_label_and_input={GAP_BETWEEN_LABEL_AND_INPUT}
            grid_template_cols={GRID_TEMPLATE_COLS}
            isProjectDataLoading={isProjectDataLoading}
            projectData={projectData?.data}
          />
        );
      default:
        return <h1>Page does not exist!</h1>;
    }
  };

  return (
    <Create wrapperProps={{ maxWidth: "768px", mx: "auto" }}>
      {userRole === "PANEL_ADMIN" ? (
        renderStage(searchParams.get("stage"))
      ) : (
        <Unauthorize />
      )}
    </Create>
  );
};
export default ProjectEdit;
