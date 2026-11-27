import { NextResponse, type NextRequest } from "next/server";
import { env, version } from "@/lib/env";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  request.headers.set("x-json4u-version", version);
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  // 新版 EdgeOne OpenNext 运行时会在全局 Middleware 中异常，静态页面无需刷新会话，
  // 因此仅让认证相关 API 经过 Middleware，避免首页和编辑器返回 545。
  matcher: ["/api/auth/:path*"],
};
