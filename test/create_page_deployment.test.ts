import { expect, test } from "vitest";
import { createPageDeployment } from "./src/create_page_deployment.ts";

test("it sends request to github api", () => {
  createPageDeployment();
});
