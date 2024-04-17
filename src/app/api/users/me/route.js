import { connect } from "../../../db/dbconfig.js";
import { User } from "../../../models/user.model";
import { NextRequest, NextResponse } from "next/server";

import { getDataFromToken } from "../../../helper/me.js";
connect();

export async function POST(request) {
  try {
    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    const response =  NextResponse.json({
      Message: "user found",
      data: user,
    });
    return response 
  } catch (error) {
    console.log(error);
    throw error
    return NextResponse.json({
      error: "An error occurred while processing your request",
    });
  }
}
