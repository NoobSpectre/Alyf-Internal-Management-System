"use client";

import {
  ContinueSubmitButton,
  DynamicTable,
  LeaveSubmitButton,
} from "@/components/ui";
import { TProject, TStageProps } from "@/types";
import { saveAndContinue, saveAndLeave } from "@/utils/db";
import { Box, Divider, Grid, GridItem, useToast } from "@chakra-ui/react";
import { useGo } from "@refinedev/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const NEXT_STAGE = 4;

export const Stage3 = ({
  id,
  resource,
  isPhone,
  colorMode,
  isProjectDataLoading,
  projectData,
}: TStageProps) => {
  const [saveAndLeaveLoading, setSaveAndLeaveLoading] = useState(false);
  const [saveAndContinueLoading, setSaveAndContinueLoading] = useState(false);

  const go = useGo();
  const toast = useToast();
  const queryClient = useQueryClient();

  const formMethods = useForm<TProject>({
    defaultValues: {
      investment_breakdown: projectData?.investment_breakdown,
      other_charges: projectData?.other_charges,
      full_investment_breakdown: projectData?.full_investment_breakdown,
      full_other_charges: projectData?.full_other_charges,
    },
  });

  useEffect(() => {
    formMethods.reset(projectData);
  }, [formMethods, projectData]);

  const goToStageFns = (stageToGo?: number): SubmitHandler<TProject> => {
    return async data => {
      if (stageToGo) setSaveAndContinueLoading(true);
      else setSaveAndLeaveLoading(true);

      data = {
        ...data,
        stages_completed:
          data["stages_completed"] < 3 ? 3 : data["stages_completed"],
      };

      if (stageToGo)
        await saveAndContinue(data, go, toast, stageToGo, {
          from: resource,
          columnToMatch: "project_id",
          valueToMatchBy: id,
        });
      else
        await saveAndLeave(data, go, toast, {
          from: resource,
          columnToMatch: "project_id",
          valueToMatchBy: id,
        });

      queryClient.invalidateQueries({
        type: "all",
      });

      if (stageToGo) setSaveAndContinueLoading(false);
      else setSaveAndLeaveLoading(false);
    };
  };

  const onSave = goToStageFns();
  const onSaveandContinue = goToStageFns(NEXT_STAGE);

  return (
    <FormProvider {...formMethods}>
      <form id="stage-3-form" noValidate>
        <Grid my={8} gap={5}>
          {/* investment breakdown */}
          <Grid as={GridItem} gap={2}>
            <DynamicTable
              formName="investment_breakdown"
              drawerHeader="Investment Breakdown"
              isPhone={isPhone}
            />
          </Grid>

          <Divider as={GridItem} border="1px solid" />

          {/* other charges */}
          <Grid as={GridItem} gap={2}>
            <DynamicTable
              formName="other_charges"
              drawerHeader="Other Charges"
              isPhone={isPhone}
            />
          </Grid>

          <Divider as={GridItem} border="1px solid" />

          {/* full investment breakdown */}
          <Grid as={GridItem} gap={2}>
            <DynamicTable
              formName="full_investment_breakdown"
              drawerHeader="Full Investment Breakdown"
              isPhone={isPhone}
            />
          </Grid>

          <Divider as={GridItem} border="1px solid" />

          {/* full other charges */}
          <Grid as={GridItem} gap={2}>
            <DynamicTable
              formName="full_other_charges"
              drawerHeader="Full Other Charges"
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
