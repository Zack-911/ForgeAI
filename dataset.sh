#!/bin/bash

echo "Fetching functions.json..."
curl -sSL https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json -o functions.json

echo "Generating dataset.jsonl using inline Node.js..."

node --input-type=module <<'EOF'
import fs from "fs";

const res = await fetch("https://raw.githubusercontent.com/tryforge/ForgeScript/dev/metadata/functions.json");
const data = await res.json();

const lines = data.map(fn => {
  const args = fn.args?.map(arg => `<${arg.name}>`).join(" ");
  const prompt = `ForgeScript: ${fn.name} ${args}`;
  const completion = `${fn.name}[${fn.args?.map(arg => arg.name).join(";")}]`;
  return JSON.stringify({ prompt, completion });
});

fs.writeFileSync("dataset.jsonl", lines.join("\n"));
console.log("Generated dataset.jsonl with", lines.length, "entries");
EOF