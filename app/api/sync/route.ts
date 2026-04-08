import { NextResponse } from "next/server";
import {
  type BanxicoSyncMode,
  enqueueBanxicoSync,
} from "@/lib/queue/banxico-sync";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sync-secret");
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const mode = ((body as { mode?: string }).mode ??
    "latest") as BanxicoSyncMode;

  try {
    const jobId = await enqueueBanxicoSync(mode);
    return NextResponse.json({ ok: true, mode, jobId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
