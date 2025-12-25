import { test, expect, describe } from "vitest";
import {
    createPageDeployment
} from "../src/pages.ts";

import { mockFetch } from "./support/mocking_http.ts";

describe("createPageDeployment", () => {
    const owner = "Rukomoynikov";
    const repo = "rukomoynikov";
    const artifact_id = 12345;
    const pages_build_version = "1.0.0";
    const oidc_token_url = "oidc_token_example_url";
    const oidc_bearer_token = "oidc_bear"

    process.env.GITHUB_REPOSITORY = `${owner}/${repo}`;

    const github_token = process.env.GITHUB_TOKEN
        ? process.env.GITHUB_TOKEN
        : (process.env.GITHUB_TOKEN = `my_super_secret_token${Math.floor(Math.random() * 100)}`);

    const github_api_url = process.env.GITHUB_API_URL
        ? process.env.GITHUB_API_URL
        : (process.env.GITHUB_API_URL = `https://test.github.com${Math.floor(Math.random() * 100)}`);

    test("it sends request to github api", async () => {
        mockFetch({resolver: url => url });

        await createPageDeployment({ artifact_id, github_token, pages_build_version, oidc_token_url, oidc_bearer_token });

        expect(fetch).toHaveBeenNthCalledWith(
            1,
            oidc_token_url,
            {
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${oidc_bearer_token}`,
                    "User-Agent": "actions/oidc-client"
                }
            }
        );

        expect(fetch).toHaveBeenNthCalledWith(
            2,
            `${github_api_url}/repos/${owner}/${repo}/pages/deployments`,
            {
                method: "POST",
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${github_token}`,
                    "X-GitHub-Api-Version": "2022-11-28",
                },
                body: JSON.stringify({
                    artifact_id,
                    pages_build_version
                })
            },
        );
    });
})