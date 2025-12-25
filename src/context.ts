const context = {
  workflowRunID: process.env.GITHUB_RUN_ID,
  repositoryNwo: process.env.GITHUB_REPOSITORY,
  repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
  commitSHA: process.env.GITHUB_SHA,
  actionsId: process.env.GITHUB_ACTION,
  githubToken: process.env.INPUT_TOKEN,
  githubApiUrl: process.env.GITHUB_API_URL ?? "https://api.github.com",
  githubServerUrl: process.env.GITHUB_SERVER_URL ?? "https://github.com",
  artifactName: process.env.INPUT_ARTIFACT_NAME,
};

const withCheckedValues = (ctx: typeof context) => {
  for (const [key, value] of Object.entries(ctx)) {
    if (value === undefined || value === "") {
      throw new Error(`Missing required context value: ${key}`);
    }
  }
  return ctx as {
    workflowRunID: string;
    repositoryNwo: string;
    repositoryOwner: string;
    commitSHA: string;
    actionsId: string;
    githubToken: string;
    githubApiUrl: string;
    githubServerUrl: string;
    artifactName: string;
  };
};

export { context, withCheckedValues };
