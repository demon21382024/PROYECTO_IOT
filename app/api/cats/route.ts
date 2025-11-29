import { type NextRequest, NextResponse } from "next/server"

// GET: Fetch user's cats
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('cats')
    //   .select()
    //   .eq('user_id', userId)

    const mockCats = [
      {
        id: "1",
        name: "Michi",
        breed: "Siamese",
        weight_kg: 4.2,
        dateOfBirth: "2021-03-15",
      },
    ]

    return NextResponse.json({ success: true, cats: mockCats })
  } catch (error) {
    console.error("Fetch cats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create new cat profile
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    const { name, breed, dateOfBirth } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!name) {
      return NextResponse.json({ error: "Cat name is required" }, { status: 400 })
    }

    // TODO: Integrate with database
    // const { data, error } = await supabase
    //   .from('cats')
    //   .insert([{ user_id: userId, name, breed, date_of_birth: dateOfBirth }])
    //   .select()

    return NextResponse.json({
      success: true,
      message: "Cat profile created",
      cat: { id: "1", name, breed, dateOfBirth },
    })
  } catch (error) {
    console.error("Create cat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
