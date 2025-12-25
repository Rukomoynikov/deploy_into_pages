const c = async ({
  run_id: t,
  github_token: n
}) => {
  const e = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [s, i] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  const r = await fetch(
    `${e}/repos/${s}/${i}/actions/runs/${t}/artifacts`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${n}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }
  );
  if (!r.ok) throw new Error(`Response status: ${r.status}`);
  return r.json();
}, a = (t, n) => {
  if (t.total_count == 0) return null;
  for (let e = t.artifacts.length - 1; e >= 0; e--)
    if (t.artifacts[e].name == n)
      return t.artifacts[e];
  return null;
}, u = {
  workflowRunID: process.env.GITHUB_RUN_ID,
  repositoryNwo: process.env.GITHUB_REPOSITORY,
  repositoryOwner: process.env.GITHUB_REPOSITORY_OWNER,
  commitSHA: process.env.GITHUB_SHA,
  actionsId: process.env.GITHUB_ACTION,
  githubToken: process.env.INPUT_TOKEN,
  githubApiUrl: process.env.GITHUB_API_URL ?? "https://api.github.com",
  githubServerUrl: process.env.GITHUB_SERVER_URL ?? "https://github.com",
  artifactName: process.env.INPUT_ARTIFACT_NAME
}, p = (t) => {
  for (const [n, e] of Object.entries(t))
    if (e === void 0 || e === "")
      throw new Error(`Missing required context value: ${n}`);
  return t;
}, o = p(u);
async function l() {
  const t = await c({
    github_token: o.githubToken,
    run_id: o.workflowRunID
  }), n = a(
    t,
    o.artifactName
  );
  if (n == null)
    throw new Error(
      `Couldn't find artifact with name ${o.artifactName} in 
${JSON.stringify(t)}`
    );
  console.log(n);
}
l();
