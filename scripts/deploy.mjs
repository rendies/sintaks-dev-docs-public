import { execFile, execFileSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const endpoint = process.env.S3_ENDPOINT ?? "https://is3.cloudhost.id";
const region = process.env.S3_REGION ?? "ap-southeast-3";
const profile = process.env.S3_PROFILE ?? "sintaks";
const bucket = process.env.S3_BUCKET ?? "docs.sintaks.dev";
const dryRun = process.env.DEPLOY_DRY_RUN === "1";
const concurrency = Math.max(1, Number(process.env.S3_UPLOAD_CONCURRENCY ?? 4));
const uploadTimeoutMs = Math.max(5_000, Number(process.env.S3_UPLOAD_TIMEOUT_MS ?? 60_000));
const uploadRetries = Math.max(0, Number(process.env.S3_UPLOAD_RETRIES ?? 3));

// IDCloudHost's S3 endpoint rejects AWS CLI chunked checksum trailers with
// HTTP 411 MissingContentLength.
process.env.AWS_REQUEST_CHECKSUM_CALCULATION ??= "when_required";

if (!existsSync("dist/index.html")) {
  console.error("dist/index.html is missing. Run the build before deploying.");
  process.exit(1);
}

const baseArgs = ["--profile", profile, "--endpoint-url", endpoint, "--region", region];
const runSync = (args) => {
  console.log(`$ aws ${args.join(" ")}`);
  if (!dryRun) execFileSync("aws", args, { stdio: "inherit" });
};

const targets = [];
function visit(directory) {
  for (const entry of readdirSync(directory)) {
    const file = join(directory, entry);
    if (statSync(file).isDirectory()) visit(file);
    else if (entry === "index.html" && file !== "dist/index.html") {
      const directoryKey = relative("dist", directory).replaceAll("\\", "/");
      targets.push({ key: `${directoryKey}/`, file });
      targets.push({ key: directoryKey, file });
    }
  }
}
visit("dist");

const upload = async (key, file) => {
  const args = [
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
  ];

  let lastError = null;
  for (let attempt = 0; attempt <= uploadRetries; attempt += 1) {
    try {
      await execFileAsync("aws", args, { timeout: uploadTimeoutMs });
      return;
    } catch (err) {
      lastError = err;
      if (attempt < uploadRetries) {
        const backoffMs = 1_000 * 2 ** attempt;
        console.warn(`retry ${attempt + 1}/${uploadRetries} in ${backoffMs / 1000}s: s3://${bucket}/${key}`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }
  throw lastError;
};

const failed = [];
let nextIndex = 0;
let completed = 0;

async function worker() {
  while (true) {
    const index = nextIndex++;
    if (index >= targets.length) return;
    const { key, file } = targets[index];
    if (dryRun) {
      console.log(`$ aws s3api put-object --bucket ${bucket} --key ${key} --body ${file} ...`);
      completed += 1;
      continue;
    }
    try {
      await upload(key, file);
      completed += 1;
      if (completed % 10 === 0 || completed === targets.length) {
        console.log(`uploaded ${completed}/${targets.length} directory aliases`);
      }
    } catch {
      failed.push(key);
    }
  }
}

const start = Date.now();

runSync(["s3", "sync", "dist", `s3://${bucket}`, ...baseArgs]);
runSync([
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

await Promise.all(Array.from({ length: concurrency }, () => worker()));

if (failed.length > 0) {
  console.error(`Upload failed for ${failed.length} directory alias(es):`);
  for (const key of failed) console.error(`  s3://${bucket}/${key}`);
  process.exit(1);
}

console.log(
  `${dryRun ? "Dry run complete" : "Deployed"}: ${bucket} · ${targets.length} directory aliases in ${Math.round((Date.now() - start) / 1000)}s`,
);
