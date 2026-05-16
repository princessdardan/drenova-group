import { NextRequest } from "next/server";

import { jsonError, jsonOk } from "../_lib/responses";
import { hasValidHeaderSecret } from "../_lib/secrets";

export async function POST(request: NextRequest) {
  if (!hasValidHeaderSecret(request, "x-deploy-secret", "DEPLOY_HOOK_SECRET")) {
    return jsonError({ message: "Invalid secret" }, 401);
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployHookUrl) {
    return jsonError({ message: "Deploy hook not configured" }, 500);
  }

  try {
    const response = await fetch(deployHookUrl, { method: "POST" });

    if (!response.ok) {
      throw new Error(`Deploy hook failed: ${response.status}`);
    }

    return jsonOk({ deployed: true });
  } catch (error) {
    return jsonError({ message: "Deploy failed", error: String(error) }, 500);
  }
}
