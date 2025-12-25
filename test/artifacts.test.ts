import { test, expect, describe } from "vitest";
import {
  getArtifact,
  selectArtifact,
  type ArtifactsJSONSchema,
} from "../src/artifacts.ts";
import { mockFetch } from "./support/mocking_http.ts";

describe("getArtifact", () => {
  const github_api_url = process.env.GITHUB_API_URL
    ? process.env.GITHUB_API_URL
    : (process.env.GITHUB_API_URL = `https://test.github.com${Math.floor(Math.random() * 100)}`);

  const github_token = process.env.GITHUB_TOKEN
    ? process.env.GITHUB_TOKEN
    : (process.env.GITHUB_TOKEN = `my_super_secret_token${Math.floor(Math.random() * 100)}`);

  const owner = "Rukomoynikov";
  const repo = "rukomoynikov";
  const run_id = "777";

  process.env.GITHUB_REPOSITORY = `${owner}/${repo}`;

  test("it sends request to github api", async () => {
    mockFetch({ resolver: (url) => url });

    await getArtifact({ run_id, github_token });

    expect(fetch).toHaveBeenCalledWith(
      `${github_api_url}/repos/${owner}/${repo}/actions/runs/${run_id}/artifacts`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${github_token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
  });

  test("it responds with error if status is not ok", async () => {
    mockFetch({ status: 500 });

    try {
      await getArtifact({ run_id, github_token });
    } catch (err) {
      expect(err).toEqual(new Error("Response status: 500"));
    }
  });
});

describe("getArtifact", () => {
  let artifcats: ArtifactsJSONSchema = {
    total_count: 1,
    artifacts: [],
  };

  let artifact = {
    id: 1,
    node_id: "1",
    name: "github-pages",
    size_in_bytes: 4335907,
    url: "https://api.github.com/repos/Rukomoynikov/rukomoynikov/actions/artifacts/4963587571",
    archive_download_url:
      "https://api.github.com/repos/Rukomoynikov/rukomoynikov/actions/artifacts/4963587571/zip",
    expired: true,
    digest:
      "sha256:48930af574cd5f0a0dd0de07731612066c97fd1f183e9adbf467fbaae04d1559",
    created_at: "2025-12-24T20:50:02Z",
    updated_at: "2025-12-24T20:50:02Z",
    expires_at: "2026-03-24T20:49:29Z",
    workflow_run: {
      id: 1,
      repository_id: 1,
      head_repository_id: 1,
      head_branch: "main",
      head_sha:
        "sha256:48930af574cd5f0a0dd0de07731612066c97fd1f183e9adbf467fbaae04d1559",
    },
  };

  artifcats.artifacts.push({ ...artifact });
  artifcats.artifacts.push({ ...artifact, id: 2 });

  test("it selects last artifact", async () => {
    expect(selectArtifact(artifcats, "github-pages")).toEqual({
      ...artifact,
      id: 2,
    });
  });
});
