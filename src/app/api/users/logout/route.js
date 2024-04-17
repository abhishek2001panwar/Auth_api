import { connect } from "../../../db/dbconfig";
import { NextResponse } from "next/server";

connect();

export async function GET(request) {
  try {

    const response =  NextResponse.json({
        message: " logged out suuceefully",
        
    })
  response.cookies.set("token", "" , {httpOnly: true})
  return response
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "An error occurred while logging out your request",
    });
  }
}
