// Load .env.local first (takes precedence), then .env as fallback
// Ensures DATABASE_URL works whether it's in .env or .env.local
import * as dotenv from "dotenv"
import * as path from "path"
import * as fs from "fs"

const localEnvPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath })
}
dotenv.config() // loads .env (existing vars are NOT overwritten)

import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
})
