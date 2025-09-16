'use client'; // ✅ REQUIRED in Next.js App Router for components that use hooks or navigation

import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReviewExperiment from "./review-experiment";
import { useExperimentMutations } from "@hooks/useExperimentMutations";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { useOrgProjectsContext } from "@context/orgProjectsContext";

// ❌ REMOVED: react-router-dom navigate (does nothing in Next.js App Router)
// import { useNavigate } from "react-router-dom";

// ✅ ADDED: Next.js navigation hook
import { useRouter } from "next/navigation";

export function CreateExperiment({
  onBack,      // parent-controlled stepper back handler (optional)
  resetForm,   // clears the wizard to start a new experiment
  formdata,    // all collected values from previous steps
}) {
  // ❌ REMOVED: const navigate = useNavigate();
  // ✅ ADDED: Next.js router
  const router = useRouter();

  const { createMutation } = useExperimentMutations();
  const { selectedProject } = useOrgProjectsContext();

  const [createstatus, setcreatestatus] = useState<"creating" | null>(null);

  // Keep your mutation flags
  const {
    data: createData,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
  } = createMutation;

  // Build parameters/payload exactly as before
  const parameters = {
    platform: formdata.platform,
    clusterName: formdata.parameters.clusterName,
    resources: Array.isArray(formdata.parameters?.resources)
      ? formdata.parameters.resources.map((resource: string) => ({
          namespace: formdata.parameters.namespace,
          pod_name: resource,
        }))
      : [],
  };

  const payload = {
    name: formdata.experimentName,
    action: formdata.experimentType,
    description: formdata.experimentDescription,
    project: selectedProject,
    environment_id: formdata.envId,
    created_by: 43226675,
    parameters,
    grace_period: 5,
    propagation_policy: "Background",
  };

  // ✅ UPDATED: prevent default submit (important because this component is wrapped in <form>)
  const handleCreateExperiment = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    try {
      setcreatestatus("creating");
      await createMutation.mutateAsync({ payload });
    } catch (error) {
      console.error("Error creating experiment:", error);
    }
  };

  // Loading / error / success UIs unchanged except navigation fix
  if (isCreatePending) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Alert
          severity="info"
          icon={<CircularProgress size={20} color="inherit" />}
        >
          <Typography color="primary">
            Creating your experiment, please wait...
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (isCreateError) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Alert severity="error" icon={<ErrorIcon />}>
          <Typography color="error">
            Failed to create the experiment. Error:{" "}
            {(createError as any)?.response?.data?.detail ||
              (createError as Error).message}
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (isCreateSuccess) {
    return (
      <Stack spacing={4}>
        <Box display="flex" flexDirection="column" alignItems="left" gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Alert
              severity="success"
              icon={
                <CheckCircleIcon
                  fontSize="inherit"
                  style={{ color: "green" }}
                />
              }
            >
              <Typography color="success">
                Experiment ID {createData?.data?.experiment_code || "N/A"} is
                created successfully.
              </Typography>
            </Alert>
          </Box>
        </Box>
        <Stack spacing={2} direction="row">
          <Button onClick={resetForm} color="info" variant="outlined">
            Create another experiment
          </Button>

          {/* ✅ UPDATED: Next.js navigation to execute page */}
          <Button
            onClick={() => router.push("/dashboard/experiments/execute")}
            color="primary"
            variant="contained"
          >
            Navigate to the execute page
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleCreateExperiment}>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <ReviewExperiment formdata={formdata} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Stack spacing={2} direction="row">
          {/* ✅ UPDATED: 
              - type="button" so it doesn't submit the form
              - onClick uses parent onBack if provided (stepper case),
                otherwise falls back to a route push back to Screen 1.
              - You can use router.back() if you prefer browser history. */}
          <Button
            variant="outlined"
            startIcon={<ArrowLeftIcon />}
            type="button"
            onClick={() => {
              if (onBack) {
                onBack(); // go to previous step within the same page
              } else {
                router.push("/dashboard/experiments/create"); // go to Screen 1 route
                // or: router.back();
              }
            }}
          >
            Back
          </Button>

          {/* ✅ Keep submit for create */}
          <Button type="submit" variant="contained" color="primary">
            Create Experiment
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
