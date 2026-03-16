const WEB_SEARCH_LIMIT = 3;
const WEB_SEARCH_KEY = "web_search_count";

export const getWebSearchCount = () => {
  const raw = sessionStorage.getItem(WEB_SEARCH_KEY);
  return raw ? parseInt(raw, 10) : 0;
};

export const incrementWebSearch = () => {
  const current = getWebSearchCount();
  sessionStorage.setItem(WEB_SEARCH_KEY, String(current + 1));
};

export const isWebSearchLimitReached = () => {
  return getWebSearchCount() >= WEB_SEARCH_LIMIT;
};