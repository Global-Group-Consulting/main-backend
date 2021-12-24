export interface SecretKey {
  type: "server" | "client";
  secretKey: string;
  publicKey: string;
}
