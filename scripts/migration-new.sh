#!/usr/bin/env bash
set -euo pipefail

NAME="${1:?Usage: $0 <migration_name>}"

npx supabase migration new "$NAME"

echo "Migration created: supabase/migrations/<timestamp>_${NAME}.sql"
echo "Edit the file, then run: npx supabase db push"
