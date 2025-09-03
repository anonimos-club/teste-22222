import { type NextRequest, NextResponse } from "next/server"

const GENESIS_API_KEY =
  "sk_558e0f1fd8a077c34511b2589353ed7d43e6cf4dcce46eee980ea9dbb943f0b8dd2fa0182eb4f6605e15e8ab2ba0d955fcc6d2d9b22cb53e7110635971191ab2"
const GENESIS_BASE_URL = "https://api.genesys.finance"

export async function GET(request: NextRequest, { params }: { params: { transactionId: string } }) {
  try {
    const { transactionId } = params

    console.log("[v0] Checking transaction status:", transactionId)

    const response = await fetch(`${GENESIS_BASE_URL}/v1/transactions/${transactionId}`, {
      method: "GET",
      headers: {
        "api-secret": GENESIS_API_KEY,
      },
    })

    const result = await response.json()
    console.log("[v0] Transaction status response:", result)

    if (!response.ok) {
      throw new Error(`Genesis API error: ${result.message || "Unknown error"}`)
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      transaction: result,
    })
  } catch (error) {
    console.error("[v0] Error checking transaction status:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
