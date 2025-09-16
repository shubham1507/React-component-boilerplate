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

// ⬇️ FIXED: changed from @hooks/... to relative path
import { useExperimentMutations } from "../../../../hooks/useExperimentMutations";

// ⬇️ FIXED: changed from @phosphor-icons/... to direct package import
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react";

// ⬇️ FIXED: changed from @context/... to relative path
import { useOrgProjectsContext } from "../../../../context/orgProjectsContext";

export function CreateExperiment({ onBack, resetForm, formdata }) {
  const { createMutation } = useExperimentMutations();
  const { selectedProject } = useOrgProjectsContext();

  const [createstatus, setcreatestatus] = useState(null);

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<ArrowLeftIcon />}
        onClick={onBack}
      >
        Back
      </Button>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6">Create Experiment</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {createstatus === "loading" && (
              <CircularProgress size={24} />
            )}
            {createstatus === "success" && (
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
              >
                Experiment created successfully!
              </Alert>
            )}
            {createstatus === "error" && (
              <Alert
                severity="error"
                icon={<ErrorIcon />}
              >
                Failed to create experiment.
              </Alert>
            )}
          </Stack>

          {/* ReviewExperiment component */}
          <ReviewExperiment
            formdata={formdata}
            onSubmit={async () => {
              setcreatestatus("loading");
              try {
                await createMutation({
                  ...formdata,
                  projectId: selectedProject?.id,
                });
                setcreatestatus("success");
                resetForm();
              } catch (err) {
                setcreatestatus("error");
              }
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
