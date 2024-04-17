import { connect } from "../../app/db/dbconfig.js";
import { NextRequest, NextResponse } from "next/server";

import  jwt  from "jsonwebtoken";
connect();

export const getDataFromToken = (request) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken = jwt.verify(token, process.env.Token_Data);
    return decodedToken.id;
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: "An error occurred while processing your request",
    });
  }
};
