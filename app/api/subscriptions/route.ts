import { type NextRequest, NextResponse } from "next/server"

// GET: Fetch user's current subscription
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('user_subscriptions')
    //   .select('*, subscription_plans(*)')
    //   .eq('user_id', userId)
    //   .eq('status', 'active')
    //   .single()

    const mockSubscription = {
      id: "1",
      plan: "free",
      status: "active",
      startedAt: new Date(),
      maxCats: 1,
      historyDays: 1,
    }

    return NextResponse.json({ success: true, subscription: mockSubscription })
  } catch (error) {
    console.error("Fetch subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create or upgrade subscription
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { planId, stripePaymentMethodId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // TODO: Integrate with Stripe
    // const stripeCustomer = await stripe.customers.create({
    //   email: userEmail,
    //   payment_method: stripePaymentMethodId,
    //   invoice_settings: { default_payment_method: stripePaymentMethodId }
    // })

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('user_subscriptions')
    //   .insert([{
    //     user_id: userId,
    //     plan_id: planId,
    //     stripe_subscription_id: stripeSubscription.id,
    //     status: 'active'
    //   }])

    return NextResponse.json({
      success: true,
      message: "Subscription created",
      subscription: { userId, planId, status: "active" },
    })
  } catch (error) {
    console.error("Create subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
