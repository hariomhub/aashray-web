import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, email, phone, notes } = body;

    // Server-side validation
    if (!name || !company || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // TODO: Integrate actual email provider (e.g., Resend, SendGrid) here.
    // Example:
    // await resend.emails.send({
    //   from: 'Aashray Website <onboarding@resend.dev>',
    //   to: 'sales@aashrayinfotech.com',
    //   subject: `New Demo Request from ${company}`,
    //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nNotes: ${notes || 'None'}`,
    // });
    
    // TODO: Optional - Write to database or Google Sheet here.

    // Simulate network delay for the placeholder
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Return success
    return NextResponse.json(
      { success: true, message: "Demo request received successfully" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
