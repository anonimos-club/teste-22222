import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json()
    console.log("[v0] Genesis webhook received:", webhookData)

    const { id, external_id, status, total_amount, payment_method } = webhookData

    // Here you would typically:
    // 1. Verify the webhook signature for security
    // 2. Update the transaction status in your database
    // 3. Update user credits if payment is authorized
    // 4. Send notifications to the user

    if (status === "AUTHORIZED") {
      console.log("[v0] Payment authorized for transaction:", external_id)
      // Update user credits logic would go here
    } else if (status === "FAILED") {
      console.log("[v0] Payment failed for transaction:", external_id)
    }

    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Error processing Genesis webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
