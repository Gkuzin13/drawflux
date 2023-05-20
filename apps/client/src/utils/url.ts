export const urlSearchParam = {
  set: (key: string, value: string) => {
    const url = new URL(window.location.href);

    url.searchParams.set(key, value);

    return url;
  },
  get: (key: string) => {
    const params = new URLSearchParams(window.location.search);

    return params.get(key);
  },
};
