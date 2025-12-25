const T = async ({
  run_id: e,
  github_token: o
}) => {
  const t = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [r, i] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  const s = await fetch(
    `${t}/repos/${r}/${i}/actions/runs/${e}/artifacts`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${o}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }
  );
  if (!s.ok) throw new Error(`Response status: ${s.status}`);
  return s.json();
}, h = (e, o) => {
  if (e.total_count == 0) return null;
  for (let t = e.artifacts.length - 1; t >= 0; t--)
    if (e.artifacts[t].name == o)
      return e.artifacts[t];
  return null;
}, d = async ({ artifact_id: e, github_token: o, pages_build_version: t, oidc_token_url: r, oidc_bearer_token: i }) => {
  const s = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [c, p] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  const u = await (await fetch(r, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${i}`,
      "User-Agent": "actions/oidc-client"
    }
  })).json(), { value: _ } = u, a = await fetch(
    `${s}/repos/${c}/${p}/pages/deployments`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${o}`,
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: JSON.stringify({
        artifact_id: e,
        pages_build_version: t,
        oidc_token: _
      })
    }
  );
  if (!a.ok) throw new Error(`Response status: ${a.status}`);
  return a.json();
}, I = {
  workflowRunID: process.env.GITHUB_RUN_ID,
  repositoryNwo: process.env.GITHUB_REPOSITORY,
  repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
  commitSHA: process.env.GITHUB_SHA,
  actionsId: process.env.GITHUB_ACTION,
  githubToken: process.env.INPUT_TOKEN,
  githubApiUrl: process.env.GITHUB_API_URL ?? "https://api.github.com",
  githubServerUrl: process.env.GITHUB_SERVER_URL ?? "https://github.com",
  artifactName: process.env.INPUT_ARTIFACT_NAME,
  oidcTokenURL: process.env.ACTIONS_ID_TOKEN_REQUEST_URL,
  oidcTokenBearerToken: process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN
}, l = (e) => {
  for (const [o, t] of Object.entries(e))
    if (t === void 0 || t === "")
      throw new Error(`Missing required context value: ${o}`);
  return e;
}, n = l(I);
async function R() {
  const e = await T({
    github_token: n.githubToken,
    run_id: n.workflowRunID
  }), o = h(
    e,
    n.artifactName
  );
  if (o == null)
    throw new Error(
      `Couldn't find artifact with name ${n.artifactName} in 
${JSON.stringify(e)}`
    );
  await d({
    github_token: n.githubToken,
    artifact_id: o.id,
    pages_build_version: n.commitSHA,
    oidc_token_url: n.oidcTokenURL,
    oidc_bearer_token: n.oidcTokenBearerToken
  });
}
R();
