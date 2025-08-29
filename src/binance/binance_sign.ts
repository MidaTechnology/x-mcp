import crypto from "crypto";

function signQuery(query: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(query).digest("hex");
}