import { type NextRequest, NextResponse } from "next/server"

// GET: Fetch health alerts for a cat
export async function GET(request: NextRequest) {
  try {
    const catId = request.nextUrl.searchParams.get("catId")
    const unreadOnly = request.nextUrl.searchParams.get("unread") === "true"

    if (!catId) {
      return NextResponse.json({ error: "Cat ID is required" }, { status: 400 })
    }

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('health_alerts')
    //   .select()
    //   .eq('cat_id', catId)
    //   .eq('is_read', false)
    //   .order('created_at', { ascending: false })

    const mockAlerts = [
      {
        id: "1",
        type: "visit_duration",
        severity: "medium",
        message: "Visita más larga de lo normal: 5m 48s",
        timestamp: new Date(),
      },
    ]

    return NextResponse.json({ success: true, alerts: mockAlerts })
  } catch (error) {
    console.error("Fetch alerts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH: Mark alert as read
export async function PATCH(request: NextRequest) {
  try {
    const { alertId } = await request.json()

    if (!alertId) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 })
    }

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('health_alerts')
    //   .update({ is_read: true })
    //   .eq('id', alertId)

    return NextResponse.json({ success: true, message: "Alert marked as read" })
  } catch (error) {
    console.error("Update alert error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
