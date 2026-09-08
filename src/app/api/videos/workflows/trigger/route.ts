import { Client } from "@upstash/workflow";
import { NextResponse } from "next/server";

const client = new Client({
    token: process.env.QSTASH_TOKEN!,
});

export async function POST() {
    const { workflowRunId } = await client.trigger({
        url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
    });

    return NextResponse.json({
        workflowRunId,
    });
}