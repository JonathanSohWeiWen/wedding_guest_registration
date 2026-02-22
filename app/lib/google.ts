import { google } from "googleapis";

const KEYFILE_PATH = "./.secrets/credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function authenticate() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILE_PATH,
      scopes: SCOPES,
    });
    return auth;
  } catch (err) {
    console.error("Google authenticate error:", err);
    throw err;
  }
}

export async function getSheetsClient() {
  const auth = await authenticate();
  return google.sheets({ version: "v4", auth });
}
