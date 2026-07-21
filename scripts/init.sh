#!/usr/bin/env bash
set -euo pipefail

echo "=== TWallet Services — Init ==="

# Install deps
npm install

# Init Supabase local
npx supabase start

# Generate types
npm run gen:types

# Run migrations locally
npx supabase db reset

echo "=== Done ==="
