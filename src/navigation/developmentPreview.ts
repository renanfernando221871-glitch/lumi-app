export type FarmActivityPreviewRequest = {
  activityId: string;
};

export function getFarmActivityPreviewRequest(
  href: string,
  isDevelopment: boolean,
): FarmActivityPreviewRequest | undefined {
  if (!isDevelopment) return undefined;

  const url = new URL(href, "http://localhost");
  if (url.searchParams.get("preview") !== "true") return undefined;

  const routeMatch = url.pathname.match(/^\/farm\/activity\/([^/]+)\/?$/);
  const activityId =
    routeMatch?.[1] ??
    url.searchParams.get("farmActivity") ??
    url.searchParams.get("activityId");

  if (!activityId) return undefined;
  try {
    return { activityId: decodeURIComponent(activityId) };
  } catch {
    return undefined;
  }
}