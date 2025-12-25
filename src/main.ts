import { getArtifact, selectArtifact } from "./artifacts";
import { context, withCheckedValues } from "./context";

const contextValues = withCheckedValues(context);

async function main() {
  const run_artifacts = await getArtifact({
    github_token: contextValues.githubToken,
    run_id: contextValues.workflowRunID,
  });

  const selectedArtifact = selectArtifact(
    run_artifacts,
    contextValues.artifactName,
  );

  if (selectedArtifact == null) {
    throw new Error(
      `Couldn't find artifact with name ${contextValues.artifactName} in \n${JSON.stringify(run_artifacts)}`,
    );
  }

  console.log(selectedArtifact);
}

main();
