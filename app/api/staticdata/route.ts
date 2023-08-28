import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request: any) {
  //Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), 'data/ja/master');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/card.json', 'utf8');
  return NextResponse.json({ message: fileContents }, { status: 200 });
}

// To handle a POST request to /api
export async function POST(request: any) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// Same logic to add a `PATCH`, `DELETE`...