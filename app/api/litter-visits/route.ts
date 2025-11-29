import { type NextRequest, NextResponse } from "next/server"

// GET: Fetch litter visits for a cat
export async function GET(request: NextRequest) {
  try {
    const catId = request.nextUrl.searchParams.get("catId")
    const days = request.nextUrl.searchParams.get("days") || "7"

    if (!catId) {
      return NextResponse.json({ error: "Cat ID is required" }, { status: 400 })
    }

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('litter_visits')
    //   .select()
    //   .eq('cat_id', catId)
    //   .gte('visit_timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000))
    //   .order('visit_timestamp', { ascending: false })

    const mockVisits = [
      { id: "1", timestamp: new Date(Date.now() - 5 * 60 * 1000), duration: 324, weight: 4.2 },
      { id: "2", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), duration: 290, weight: 4.18 },
      { id: "3", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), duration: 580, weight: 4.2, anomaly: true },
    ]

    return NextResponse.json({ success: true, visits: mockVisits })
  } catch (error) {
    console.error("Fetch visits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Record new litter visit from IoT device
export async function POST(request: NextRequest) {
  try {
    const { catId, duration, weight, deviceToken } = await request.json()

    // TODO: Verify device token
    if (!deviceToken || !catId) {
      return NextResponse.json({ error: "Invalid device credentials" }, { status: 401 })
    }

    // Simple anomaly detection: duration > 5 minutes or unusual weight change
    const anomalyDetected = duration > 300

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('litter_visits')
    //   .insert([{
    //     cat_id: catId,
    //     duration_seconds: duration,
    //     weight_kg: weight,
    //     anomaly_detected: anomalyDetected,
    //     visit_timestamp: new Date()
    //   }])
    //   .select()

    // TODO: Trigger alert if anomaly detected
    if (anomalyDetected) {
      // Insert alert into health_alerts table
      console.log("Anomaly detected, creating alert")
    }

    return NextResponse.json({
      success: true,
      message: "Visit recorded",
      anomalyDetected,
    })
  } catch (error) {
    console.error("Record visit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
