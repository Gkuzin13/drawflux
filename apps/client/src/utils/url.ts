export const urlSearchParam = {
  set: (key: string, value: string, initialUrl = window.location.href) => {
    const url = new URL(initialUrl);

    url.searchParams.set(key, value);

    return url;
  },
  get: (key: string, initialUrl = window.location.search) => {
    const params = new URLSearchParams(initialUrl);

    return params.get(key);
  },
};
