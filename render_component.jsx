// create-experiment.jsx
// ---------------------
// This version removes the earlier navigate(-1) logic
// and drives the wizard step using a URL query param (?step=<index>).

import React from "react";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Paper,
} from "@mui/material";
// NEW: useSearchParams to read/write the step in the URL
import { useSearchParams } from "react-router-dom";

// Optional: use your existing icons
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

// Wizard step labels (adjust text if needed)
const STEP_LABELS = [
  "CHOOSE PLATFORM",
  "SELECT AN ENVIRONMENT",
  "CHOOSE EXPERIMENT BASED ON RESOURCE TYPE",
  "PROVIDE EXPERIMENT PARAMETERS",
  "REVIEW EXPERIMENT",
];

export default function CreateExperiment() {
  // NEW: read and control step from the URL (`/dashboard/experiments/create?step=4`)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStep = Number(searchParams.get("step") ?? 0); // default to 0

  // NEW: helper to jump to any step and keep the URL in sync
  const goToStep = (i) => setSearchParams({ step: String(i) });

  // Convenience helpers (use in your step actions if you like)
  const goNext = () => goToStep(Math.min(activeStep + 1, STEP_LABELS.length - 1));
  const goBack = () => goToStep(Math.max(activeStep - 1, 0));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Create Chaos Experiment
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {STEP_LABELS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* STEP 1: Choose Platform */}
      {activeStep === 0 && (
        <Box>
          {/* Replace this with your existing Step-1 component */}
          {/* e.g. <ChoosePlatform onNext={() => goToStep(1)} /> */}
          <Typography sx={{ mb: 2 }}>
            Step 1 content (Choose Platform) goes here.
          </Typography>
          <Button variant="contained" onClick={() => goToStep(1)}>
            Next
          </Button>
        </Box>
      )}

      {/* STEP 2: Select Environment */}
      {activeStep === 1 && (
        <Box>
          {/* Replace with your existing Step-2 component */}
          {/* e.g. <SelectEnvironment onBack={() => goToStep(0)} onNext={() => goToStep(2)} /> */}
          <Typography sx={{ mb: 2 }}>
            Step 2 content (Select Environment) goes here.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => goToStep(0)}>
              Back
            </Button>
            <Button variant="contained" onClick={() => goToStep(2)}>
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* STEP 3: Choose experiment by resource type */}
      {activeStep === 2 && (
        <Box>
          {/* Replace with your existing Step-3 component */}
          {/* e.g. <ChooseExperimentType onBack={() => goToStep(1)} onNext={() => goToStep(3)} /> */}
          <Typography sx={{ mb: 2 }}>
            Step 3 content (Choose Experiment by Resource Type) goes here.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => goToStep(1)}>
              Back
            </Button>
            <Button variant="contained" onClick={() => goToStep(3)}>
              Next
            </Button>
          </Box>
        </Box>
      )}

      {/* STEP 4: Provide experiment parameters */}
      {activeStep === 3 && (
        <Box>
          {/* Replace with your existing Step-4 component */}
          {/* e.g. <ProvideExperimentParams onBack={() => goToStep(2)} onReview={() => goToStep(4)} /> */}
          <Typography sx={{ mb: 2 }}>
            Step 4 content (Provide Experiment Parameters) goes here.
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => goToStep(2)}>
              Back
            </Button>
            {/* IMPORTANT: this is where you previously sent users to the review screen */}
            <Button variant="contained" onClick={() => goToStep(4)}>
              Review Experiment
            </Button>
          </Box>
        </Box>
      )}

      {/* STEP 5: Review experiment (final screen shown in your screenshot) */}
      {activeStep === 4 && (
        <ReviewExperiment goToStep={goToStep} />
      )}
    </Box>
  );
}

/**
 * Review step panel (inline here for clarity).
 * If you already have a dedicated review component file, you can delete this
 * component and import yours instead — just remember to pass `goToStep`.
 */
function ReviewExperiment({ goToStep }) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review Experiment
      </Typography>

      {/* Render your review summary/details here (platform, env, params, selections, etc.) */}

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        {/* NEW: Back goes deterministically to Step 4 (index 3) */}
        <Button
          variant="outlined"
          startIcon={<ArrowLeftIcon />}
          onClick={() => goToStep(3)} // <-- This replaces the old navigate(-1) code
        >
          Back
        </Button>

        {/* Keep your Create/Submit handler as-is */}
        <Button variant="contained" color="primary">
          Create Experiment
        </Button>
      </Box>
    </Box>
  );
}
