import { useRouter } from 'next/router';

import { getBasePath } from 'lib/env';

export const useUrlParam = <T extends string>(paramKey: string) => {
  const router = useRouter();

  const value = router.query[paramKey] as T | undefined;

  const setValue = (
    next: T | undefined | null,
    { replace = true, shallow = true } = {},
  ) => {
    const nextUrl = new URL(router.asPath, getBasePath());

    if (next != null) nextUrl.searchParams.set(paramKey, next);
    else nextUrl.searchParams.delete(paramKey);

    router[replace ? 'replace' : 'push'](nextUrl, undefined, {
      shallow,
    });
  };

  return [value, setValue] as const;
};
