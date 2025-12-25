interface getArtifactParams {
  run_id: string;
  github_token: string;
}

export interface ArtifactSchema {
  id: number;
  node_id: string;
  name: string;
  size_in_bytes: number;
  url: string;
  archive_download_url: string;
  expired: boolean;
  created_at: string;
  expires_at: string;
  updated_at: string;
  digest: string;
  workflow_run: {
    id: number;
    repository_id: number;
    head_repository_id: number;
    head_branch: string;
    head_sha: string;
  };
}

export interface ArtifactsJSONSchema {
  total_count: number;
  artifacts: Array<ArtifactSchema>;
}

const getArtifact = async ({
  run_id,
  github_token,
}: getArtifactParams): Promise<ArtifactsJSONSchema> => {
  const apiURL = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");

  const response = await fetch(
    `${apiURL}/repos/${owner}/${repo}/actions/runs/${run_id}/artifacts`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${github_token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = response.json();

  return data;
};

const selectArtifact = (
  artifacts: ArtifactsJSONSchema,
  artifact_name: string,
): ArtifactSchema | null => {
  if (artifacts.total_count == 0) return null;

  for (let index = artifacts.artifacts.length - 1; index >= 0; index--) {
    if (artifacts.artifacts[index].name == artifact_name) {
      return artifacts.artifacts[index];
    }
  }

  return null;
};

export { getArtifact, selectArtifact };
