import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const endpoint = process.env.S3_ENDPOINT ?? "https://is3.cloudhost.id";
const region = process.env.S3_REGION ?? "ap-southeast-3";
const profile = process.env.S3_PROFILE ?? "sintaks";
const bucket = process.env.S3_BUCKET ?? "docs.sintaks.dev";
const dryRun = process.env.DEPLOY_DRY_RUN === "1";

// IDCloudHost's S3 endpoint rejects AWS CLI chunked checksum trailers with
// HTTP 411 MissingContentLength.
process.env.AWS_REQUEST_CHECKSUM_CALCULATION ??= "when_required";

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html is missing. Run the build before deploying.");
  process.exit(1);
}

const baseArgs = ["--profile", profile, "--endpoint-url", endpoint, "--region", region];
const run = (args) => {
  console.log(`$ aws ${args.join(" ")}`);
  if (!dryRun) execFileSync("aws", args, { stdio: "inherit" });
};

run(["s3", "sync", "dist", `s3://${bucket}`, ...baseArgs]);
run([
  "s3",
  "cp",
  "dist/index.html",
  `s3://${bucket}/index.html`,
  ...baseArgs,
  "--content-type",
  "text/html; charset=utf-8",
  "--cache-control",
  "no-cache, no-store, must-revalidate",
]);

function visit(directory) {
  for (const entry of readdirSync(directory)) {
    const file = join(directory, entry);
    if (statSync(file).isDirectory()) visit(file);
    else if (entry === "index.html" && file !== "dist/index.html") {
      const directoryKey = relative("dist", directory).replaceAll("\\", "/");
      const keys = [`${directoryKey}/`, directoryKey];

      for (const key of keys) {
        run([
          "s3api",
          "put-object",
          "--bucket",
          bucket,
          "--key",
          key,
          "--body",
          file,
          ...baseArgs,
          "--content-type",
          "text/html; charset=utf-8",
          "--cache-control",
          "no-cache, no-store, must-revalidate",
        ]);
      }
    }
  }
}

visit("dist");
console.log(`${dryRun ? "Dry run complete" : "Deployed"}: ${bucket}`);
