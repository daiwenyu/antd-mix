export const getUrlParams = (str?: string) => {
  let paramsStr = window.location.search;
  if (typeof str === 'string') {
    if (str.startsWith('http')) {
      const url = new URL(str);
      paramsStr = url.search;
    } else {
      paramsStr = str;
    }
  }
  const searchParams = new URLSearchParams(paramsStr);
  const params: any = {};
  for (let v of searchParams.entries()) {
    params[v[0]] = v[1];
  }
  return params;
};
