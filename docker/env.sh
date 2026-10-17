#!/bin/sh
set -eu

json_string() {
  printf '%s' "$1" | awk '
    BEGIN { ORS = "" }
    {
      if (NR > 1) printf "\\n"
      gsub(/\\/, "\\\\")
      gsub(/"/, "\\\"")
      gsub(/\r/, "\\r")
      gsub(/\t/, "\\t")
      gsub(/</, "\\u003c")
      printf "%s", $0
    }
  '
}

emit() {
  printf '  %s: "%s",\n' "$1" "$(json_string "$2")"
}

{
  printf 'window.__APP_CONFIG__ = {\n'
  emit VITE_HOST "${API_BASE:-}"
  printf '};\n'
} > /usr/share/nginx/html/config.js
