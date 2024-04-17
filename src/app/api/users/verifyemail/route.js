import { connect } from "../../../db/dbconfig";
import { User } from "../../../models/user.model.js";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { token } = reqBody;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    
    if (!user) {
      return NextResponse.json({
        error: "Invalid or expired token",
      });
    }
    
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

 const response =  NextResponse.json({
      message: "Email verified successfully",
    });
    return response
  } catch (error) {
    console.log(error.message);
    return NextResponse.json({
      error: "An error occurred while processing your request",
    });
  }
}
