# Build Cache Issue Fix

The build error you're experiencing is due to stale type definitions in the `.next` directory from a previous build.

## Solution

Run the following command to clean the build cache and rebuild:

\`\`\`bash
npm run clean:build
\`\`\`

Or manually:

\`\`\`bash
# On Windows (PowerShell)
Remove-Item -Recurse -Force .next
npm run build

# On Windows (Command Prompt)
rmdir /s /q .next
npm run build

# On Linux/Mac
rm -rf .next
npm run build
\`\`\`

## What This Does

- Removes the `.next` directory which contains cached build artifacts and generated type definitions
- Rebuilds the project from scratch with the current source files

## Why This Happened

The `.next/types` directory contained outdated type definitions that referenced a `Navigation` export that no longer exists in your page files. Cleaning the cache forces Next.js to regenerate all type definitions from the current source code.