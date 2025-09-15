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

/* ✨ ADDED: useNavigate for success redirect and Back fallback */
import { useNavigate } from "react-router-dom";

export function CreateExperiment({ onBack, resetForm, formdata }) {
  const { createMutation } = useExperimentMutations();
  const { selectedProject } = useOrgProjectsContext();

  /* ✨ ADDED: instantiate navigate */
  const navigate = useNavigate();

  const [createstatus, setcreatestatus] = useState(null);

  console.log("formdata:", formdata);

  const {
    data: createData,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
    error: createError
  } = createMutation;

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
    environment_id: formdata.envId, // Assuming formdata contains environmentId
    created_by: 43226675, // Assuming formdata contains createdBy
    parameters: parameters,
    grace_period: 5,
    propagation_policy: "Background",
  };

  /* ✨ CHANGED: accept (e) and preventDefault so form submit never reloads */
  const handleCreateExperiment = async (e) => {
    if (e?.preventDefault) e.preventDefault();
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
          {/* ✨ FIXED: navigate is now defined via useNavigate */}
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
    /* ✨ CHANGED: attach handleCreateExperiment to onSubmit safely */
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
          <Button
            variant="outlined"
            startIcon={<ArrowLeftIcon />}
            /* ✨ ADDED: real Back behavior
               1) If parent provided onBack (stepper-based), use it.
               2) Else fall back to the known route for step-4 of the wizard. */
            onClick={() => {
              if (typeof onBack === "function") {
                onBack();                 // go back one step in the parent-controlled stepper
              } else {
                navigate("/dashboard/experiments/create?step=3"); // fallback to step-4
              }
            }}
          >
            Back
          </Button>
          <Button
            onClick={handleCreateExperiment}
            variant="contained"
            color="primary"
            type="submit"
          >
            Create Experiment
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
