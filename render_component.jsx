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

// ✅ Use react-router-dom navigation (your existing stack)
import { useNavigate } from "react-router-dom";

export function CreateExperiment({ onBack, resetForm, formdata }) {
  // ✅ create navigate instance (was missing earlier where navigate(...) was used)
  const navigate = useNavigate();

  const { createMutation } = useExperimentMutations();
  const { selectedProject } = useOrgProjectsContext();

  const [createstatus, setcreatestatus] = useState(null);

  // Keep mutation flags as-is
  const {
    data: createData,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError,
  } = createMutation;

  // Build parameters/payload exactly like before
  const parameters = {
    platform: formdata.platform,
    clusterName: formdata.parameters.clusterName,
    resources: Array.isArray(formdata.parameters?.resources)
      ? formdata.parameters.resources.map((resource) => ({
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

  // ✅ prevent default so the page doesn't reload when form submits
  const handleCreateExperiment = async (e) => {
    e?.preventDefault?.();
    try {
      setcreatestatus("creating");
      await createMutation.mutateAsync({ payload });
    } catch (error) {
      console.error("Error creating experiment:", error);
    }
  };

  if (isCreatePending) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Alert severity="info" icon={<CircularProgress size={20} color="inherit" />}>
          <Typography color="primary">Creating your experiment, please wait...</Typography>
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
            {createError?.response?.data?.detail || createError.message}
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
              icon={<CheckCircleIcon fontSize="inherit" style={{ color: "green" }} />}
            >
              <Typography color="success">
                Experiment ID {createData?.data?.experiment_code || "N/A"} is created successfully.
              </Typography>
            </Alert>
          </Box>
        </Box>
        <Stack spacing={2} direction="row">
          <Button onClick={resetForm} color="info" variant="outlined">
            Create another experiment
          </Button>

          {/* ✅ use react-router-dom navigate (not Next.js) */}
          <Button
            onClick={() => navigate("/dashboard/experiments/execute")}
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
          {/* ✅ Back button now works:
                 - type="button" so it doesn't submit the form
                 - prefers parent-provided onBack (stepper case)
                 - otherwise fallback: go to Screen 1 route
                 - you can swap to navigate(-1) if you prefer history back */}
          <Button
            variant="outlined"
            startIcon={<ArrowLeftIcon />}
            type="button"
            onClick={() => {
              if (onBack) {
                onBack(); // parent will set previous step
              } else {
                navigate("/dashboard/experiments/create"); // go to screen 1
                // or: navigate(-1); // browser back
              }
            }}
          >
            Back
          </Button>

          {/* Submit creates the experiment */}
          <Button type="submit" variant="contained" color="primary">
            Create Experiment
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
