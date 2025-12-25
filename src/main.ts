import { getArtifact, selectArtifact } from "./artifacts";
import { createPageDeployment } from "./pages";
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

  await createPageDeployment({
    github_token: contextValues.githubToken,
    artifact_id: selectedArtifact.id,
    pages_build_version: contextValues.commitSHA,
    oidc_token_url: contextValues.oidcTokenURL,
    oidc_bearer_token: contextValues.oidcTokenBearerToken
  });
}

main();
