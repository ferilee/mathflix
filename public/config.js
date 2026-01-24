docker exec -it mathflix-frontend sh -c "cat > /usr/share/nginx/html/config.js <<'EOF'
window.APP_CONFIG = {
  API_URL: \"https://api-mathflix.gemastika.or.id\",
  ADMIN_USERNAME: \"ferilee\",
  ADMIN_PASSWORD: \"F3r!-lee\",
};
EOF"
