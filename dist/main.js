const u = {
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
  oidcTokenBearerToken: process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN,
  runtimeToken: process.env.ACTIONS_RUNTIME_TOKEN
}, d = (e = u) => {
  for (const [t, o] of Object.entries(e))
    if (o === void 0 || o === "")
      throw new Error(`Missing required context value: ${t}`);
  return e;
};
class a extends Error {
}
a.prototype.name = "InvalidTokenError";
function f(e) {
  return decodeURIComponent(atob(e).replace(/(.)/g, (t, o) => {
    let n = o.charCodeAt(0).toString(16).toUpperCase();
    return n.length < 2 && (n = "0" + n), "%" + n;
  }));
}
function _(e) {
  let t = e.replace(/-/g, "+").replace(/_/g, "/");
  switch (t.length % 4) {
    case 0:
      break;
    case 2:
      t += "==";
      break;
    case 3:
      t += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return f(t);
  } catch {
    return atob(t);
  }
}
function g(e, t) {
  if (typeof e != "string")
    throw new a("Invalid token specified: must be a string");
  t || (t = {});
  const o = t.header === !0 ? 0 : 1, n = e.split(".")[o];
  if (typeof n != "string")
    throw new a(`Invalid token specified: missing part #${o + 1}`);
  let i;
  try {
    i = _(n);
  } catch (r) {
    throw new a(`Invalid token specified: invalid base64 for part #${o + 1} (${r.message})`);
  }
  try {
    return JSON.parse(i);
  } catch (r) {
    throw new a(`Invalid token specified: invalid json for part #${o + 1} (${r.message})`);
  }
}
const I = async ({
  run_id: e,
  github_token: t
}) => {
  const o = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [n, i] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  const r = await fetch(
    `${o}/repos/${n}/${i}/actions/runs/${e}/artifacts`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${t}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    }
  );
  if (!r.ok) throw new Error(`Response status: ${r.status}`);
  return r.json();
}, w = () => {
  const e = d(), t = e.runtimeToken;
  console.log(e.runtimeToken);
  const o = g(t), n = o.scp.split(" ");
  console.log(o), console.log(n);
}, k = (e, t) => {
  if (e.total_count == 0) return null;
  for (let o = e.artifacts.length - 1; o >= 0; o--)
    if (e.artifacts[o].name == t)
      return e.artifacts[o];
  return null;
}, v = async ({
  artifact_id: e,
  github_token: t,
  pages_build_version: o,
  oidc_token_url: n,
  oidc_bearer_token: i
}) => {
  const r = process.env.GITHUB_API_URL ?? "https://api.github.com";
  var [p, l] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
  const h = await (await fetch(n, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${i}`,
      "User-Agent": "actions/oidc-client"
    }
  })).json(), { value: T } = h, c = await fetch(
    `${r}/repos/${p}/${l}/pages/deployments`,
    {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${t}`,
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: JSON.stringify({
        artifact_id: e,
        pages_build_version: o,
        oidc_token: T
      })
    }
  );
  if (!c.ok)
    throw new Error(`Response status: ${c.status}`);
  return c.json();
}, s = d(u);
async function R() {
  w();
  const e = await I({
    github_token: s.githubToken,
    run_id: s.workflowRunID
  }), t = k(
    e,
    s.artifactName
  );
  if (t == null)
    throw new Error(
      `Couldn't find artifact with name ${s.artifactName} in 
${JSON.stringify(e)}`
    );
  await v({
    github_token: s.githubToken,
    artifact_id: t.id,
    pages_build_version: s.commitSHA,
    oidc_token_url: s.oidcTokenURL,
    oidc_bearer_token: s.oidcTokenBearerToken
  });
}
R();
