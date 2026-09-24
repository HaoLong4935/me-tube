import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
    console.log("🔥 WEBHOOK CALLED")
    const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET

    console.log("SIGNING_SECRET:", SIGNING_SECRET)

    if (!SIGNING_SECRET) {
        throw new Error("Please add CLERK_SIGNING_SECRET from Clerk Dashboard")
    }

    const wh = new Webhook(SIGNING_SECRET)
    // Get headers
    const headerPayload = await headers()

    console.log("==== WEBHOOK HEADERS ====")
    console.log("svix-id:", headerPayload.get("svix-id"))
    console.log("svix-timestamp:", headerPayload.get("svix-timestamp"))
    console.log("svix-signature:", headerPayload.get("svix-signature"))

    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error: Missing Sivix headers", {
            status: 400
        })
    }

    // Get body
    const body = await req.text()
    // const payload = await req.json()
    // const body = JSON.stringify(payload)

    console.log('svix-id:', svix_id)
    console.log('svix-timestamp:', svix_timestamp)
    console.log('svix-signature:', svix_signature)

    let evt: WebhookEvent

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            // Loi sai o day la ghi svix_id khong phai svix-id nen no bao loi khong nhan thay headers
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("Error: Could not verify webhook:", err)
        return new Response("Error: Vertification error", {
            status: 400
        })
    }

    const eventType = evt.type
    if (eventType === "user.created") {
        const { data } = evt
        await db.insert(users).values({
            clerkId: data.id,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url
        })
    }

    if (eventType === "user.deleted") {
        const { data } = evt
        if (!data.id) {
            return new Response("Missing user id", { status: 400 })
        }

        await db.delete(users).where(eq(users.clerkId, data.id))
    }

    if (eventType === "user.updated") {
        const { data } = evt;

        await db
            .update(users)
            .set({
                name: `${data.first_name} ${data.last_name}`,
                imageUrl: data.image_url,
            })
            .where(eq(users.clerkId, data.id));
    }

    return new Response("Webhook received", { status: 200 })
}