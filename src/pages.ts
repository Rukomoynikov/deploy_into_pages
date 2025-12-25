interface CreatePageDeploymentParams {
  artifact_id: number;
  github_token: string;
  pages_build_version: string;
  oidc_token_url: string;
  oidc_bearer_token: string;
}

const createPageDeployment = async ({
  artifact_id,
  github_token,
  pages_build_version,
  oidc_token_url,
  oidc_bearer_token,
}: CreatePageDeploymentParams) => {
  const apiURL = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");

  const OIDTokenResponse = await fetch(oidc_token_url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${oidc_bearer_token}`,
      "User-Agent": "actions/oidc-client",
    },
  });

  const tokenData = await OIDTokenResponse.json();

  const { value: oidc_token } = tokenData;

  const pageResponse = await fetch(
    `${apiURL}/repos/${owner}/${repo}/pages/deployments`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${github_token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        artifact_id,
        pages_build_version,
        oidc_token,
      }),
    },
  );

  if (!pageResponse.ok)
    throw new Error(`Response status: ${pageResponse.status}`);

  const data = pageResponse.json();

  return data;
};

const getDeploymentStatus = async (
  pages_deployment_id: string,
  github_token: string,
) => {
  const apiURL = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [owner, repo] = (process.env.GITHUB_REPOSITORY ?? "").split("/");

  const response = await fetch(
    `${apiURL}/repos/${owner}/${repo}/pages/deployments/${pages_deployment_id}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${github_token}`,
        "User-Agent": "actions/oidc-client",
      },
    },
  );

  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = await response.json();

  return data;
};

export { createPageDeployment, getDeploymentStatus };
