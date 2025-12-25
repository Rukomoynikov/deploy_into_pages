import { vi } from "vitest";

export function mockFetch({
  resolver = (url) => url,
  status = 200,
}: {
  resolver?: (url: string) => unknown;
  status?: number;
}) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((url: string) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(resolver(url)),
        status: status,
        statusText: status == 200 ? "OK" : "Error",
        clone: function () {
          return { ...this };
        },
      });
    }),
  );
}
