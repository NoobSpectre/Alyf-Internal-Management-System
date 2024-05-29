"use client";

import {
  ContinueSubmitButton,
  DynamicDescription,
  LeaveSubmitButton,
} from "@/components/ui";
import { TDescription, TStageProps } from "@/types";
import { saveAndContinue, saveAndLeave } from "@/utils/db";
import { Box, Divider, Grid, GridItem, useToast } from "@chakra-ui/react";
import { useGo } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const NEXT_STAGE = 3;

export const Stage2 = ({
  id,
  resource,
  isPhone,
  isProjectDataLoading,
  projectData,
}: TStageProps) => {
  const [saveAndLeaveLoading, setSaveAndLeaveLoading] = useState(false);
  const [saveAndContinueLoading, setSaveAndContinueLoading] = useState(false);

  const go = useGo();
  const toast = useToast();
  const queryClient = useQueryClient();

  const formMethods = useForm<TDescription>({
    defaultValues: {
      location_description: {
        title: projectData?.location_description[0],
        details: projectData?.location_description
          .slice(1)
          .map(ele => ({ value: ele })),
      },
      project_description: {
        title: projectData?.project_description[0],
        details: projectData?.project_description
          .slice(1)
          .map(ele => ({ value: ele })),
      },
      rental_prospect_description: {
        title: projectData?.rental_prospect_description[0],
        details: projectData?.rental_prospect_description
          .slice(1)
          .map(ele => ({ value: ele })),
      },
    },
  });

  useEffect(() => {
    formMethods.reset({
      location_description: {
        title: projectData?.location_description[0],
        details: projectData?.location_description
          .slice(1)
          .map(ele => ({ value: ele })),
      },
      project_description: {
        title: projectData?.project_description[0],
        details: projectData?.project_description
          .slice(1)
          .map(ele => ({ value: ele })),
      },
      rental_prospect_description: {
        title: projectData?.rental_prospect_description[0],
        details: projectData?.rental_prospect_description
          .slice(1)
          .map(ele => ({ value: ele })),
      },
    });
  }, [formMethods, projectData]);

  const goToStageFns = (stageToGo?: number): SubmitHandler<TDescription> => {
    return async data => {
      if (!projectData) return;

      if (!stageToGo) setSaveAndLeaveLoading(true);
      else setSaveAndContinueLoading(true);

      const data_to_update = {
        ...projectData,
        location_description: [
          data.location_description.title,
          ...data.location_description.details.map(({ value }) => value),
        ],
        project_description: [
          data.project_description.title,
          ...data.project_description.details.map(({ value }) => value),
        ],
        rental_prospect_description: [
          data.rental_prospect_description.title,
          ...data.rental_prospect_description.details.map(({ value }) => value),
        ],
        stages_completed:
          projectData.stages_completed < 2 ? 2 : projectData.stages_completed,
      };

      if (stageToGo)
        await saveAndContinue(data_to_update, go, toast, stageToGo, {
          from: resource,
          columnToMatch: "project_id",
          valueToMatchBy: id,
        });
      else
        await saveAndLeave(data_to_update, go, toast, {
          from: resource,
          columnToMatch: "project_id",
          valueToMatchBy: id,
        });

      queryClient.invalidateQueries({
        type: "all",
      });

      if (!stageToGo) setSaveAndLeaveLoading(false);
      else setSaveAndContinueLoading(false);
    };
  };

  const onSave = goToStageFns();
  const onSaveandContinue = goToStageFns(NEXT_STAGE);

  return (
    <FormProvider {...formMethods}>
      <form id="stage-2-form" noValidate>
        {/* form inputs container */}
        <Grid my={8} gap={8}>
          {/* location description */}
          <Grid as={GridItem} gap={2}>
            <DynamicDescription
              header="Location Description"
              formName="location_description"
              isPhone={isPhone}
            />
          </Grid>

          <Divider as={GridItem} border="1px" />

          {/* project description */}
          <Grid as={GridItem} gap={2}>
            <DynamicDescription
              header="Project Description"
              formName="project_description"
              isPhone={isPhone}
            />
          </Grid>

          <Divider as={GridItem} border="1px" />

          {/* Rental Prospect description */}
          <Grid as={GridItem} gap={2}>
            <DynamicDescription
              header="Rental Prospect Description"
              formName="rental_prospect_description"
              isPhone={isPhone}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={3}>
          <LeaveSubmitButton
            isDisabled={saveAndContinueLoading}
            isLoading={saveAndLeaveLoading}
            onClick={formMethods.handleSubmit(onSave)}
          />
          <ContinueSubmitButton
            isDisabled={saveAndLeaveLoading}
            isLoading={saveAndContinueLoading}
            onClick={formMethods.handleSubmit(onSaveandContinue)}
          />
        </Box>
      </form>
    </FormProvider>
  );
};

// <Edit
//   isLoading={isProjectDataLoading}
//   wrapperProps={{
//     maxWidth: '768px',
//     mx: 'auto',
//     px: isPhone ? '0.8rem' : '2.5rem',
//   }}
//   headerProps={{ p: 2 }}
//   title={<FormTitle property={projectData?.project_name} />}
//   headerButtonProps={{ display: 'none' }}
// >

// </Edit>
