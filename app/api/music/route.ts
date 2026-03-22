import { readdir } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".ogg", ".m4a", ".aac"]);

export async function GET() {
  const musicDirectory = path.join(process.cwd(), "public", "music");

  try {
    const entries = await readdir(musicDirectory, { withFileTypes: true });

    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) =>
        AUDIO_EXTENSIONS.has(path.extname(name).toLowerCase()),
      )
      .sort((a, b) => a.localeCompare(b, "vi"));

    const tracks = files.map((name) => `/music/${encodeURIComponent(name)}`);

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ tracks: [] }, { status: 200 });
  }
}
