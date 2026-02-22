import { JWT } from "google-auth-library";
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function getJWT() {
  return new JWT({
    email: process.env.EMAIL,
    key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"), // Replace escaped newlines with actual newlines
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Access scope for Google Sheets
  });
}

export async function getSheetsClient() {
  const jwtClient = await getJWT();
  return google.sheets({ version: "v4", auth: jwtClient });
}
