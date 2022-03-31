echo "Installing deno..."
curl -fsSL https://deno.land/x/install/install.sh | sh
export PATH="/opt/buildhome/.deno/bin:$PATH"
deno run --allow-net --allow-read --unstable --reload server.tsx -c tsconfig.json
exit 0