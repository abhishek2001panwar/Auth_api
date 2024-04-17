import { connect } from "../../../db/dbconfig";
import { User } from "../../../models/user.model.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/app/helper/mailer.js";
import jwt from 'jsonwebtoken';
connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    console.log("Request Body:", reqBody); // Add this line to log the request body

    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        error: "User already exists",
      });
    }
 const validPassword = await bcryptjs.compare(password , user.password)
    const tokenData  = {
        id: user._id,
        username: user.username,
        email: user.email,
    }
     const token =  await jwt.sign(tokenData,  process.env.Token_Data)
    const response =  NextResponse.json({
      user,
      message: "UserloggedIn successfully",
    });
    response.cookies.set("token", token ,{ httpOnly : true})
    return response
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "An error occurred while processing your request",
    });
  }
}
