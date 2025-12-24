import { getArtifact } from "./get_artifact";
import { context, withCheckedValues } from "./context";

const contextValues = withCheckedValues(context);

async function main() {
    const response = await getArtifact({
        owner: contextValues.artifactName,
        github_token: contextValues.githubToken,
        repo: contextValues.repositoryNwo,
        run_id: contextValues.workflowRunID,
    });

    const data = await response.json

    console.log(data)
}

main()
