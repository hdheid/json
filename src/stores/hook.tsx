"use client";

import { type Config, defaultConfig } from "@/lib/db/config";
import { tryCatch } from "@/lib/utils";
import Cookies from "js-cookie";
import { useMemo, useSyncExternalStore } from "react";

// 浏览器 Cookie 不参与服务端渲染，保证 /editor 可以保持静态预渲染。
export function useConfigFromCookies() {
  const rawConfig = useSyncExternalStore(
    () => () => {},
    () => Cookies.get("config") ?? "",
    () => "",
  );

  return useMemo(
    () => tryCatch<Config>(() => JSON.parse(rawConfig)["state"], defaultConfig),
    [rawConfig],
  );
}
