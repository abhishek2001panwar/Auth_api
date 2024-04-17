import { connect } from "../../../db/dbconfig";
import { User } from "../../../models/user.model.js";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/app/helper/mailer.js";

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    console.log("Request Body:", reqBody); // Add this line to log the request body

    const { username, email, password } = reqBody;

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({
        error: "User already exists",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser =  new User({
      username,
      password: hashedPassword,
      email,
    });
    const savedUser = await newUser.save();

    await sendEmail({ email, emailtype: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      savedUser,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "An error occurred while processing your request",
    });
  }
}
