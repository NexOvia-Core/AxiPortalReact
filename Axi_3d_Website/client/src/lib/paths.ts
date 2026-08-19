const appBasePath = import.meta.env.BASE_URL;

/** Resolves public files beneath the Vite deployment base path. */
export function assetUrl(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  return `${appBasePath}${path.replace(/^\/+/, "")}`;
}
