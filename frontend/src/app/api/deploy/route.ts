import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-deploy-secret");

  if (!secret || secret !== process.env.DEPLOY_HOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployHookUrl) {
    return NextResponse.json(
      { message: "Deploy hook not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(deployHookUrl, { method: "POST" });

    if (!response.ok) {
      throw new Error(`Deploy hook failed: ${response.status}`);
    }

    return NextResponse.json({ deployed: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Deploy failed", error: String(error) },
      { status: 500 }
    );
  }
}
