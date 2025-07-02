docker exec -it cms-db \
  psql -U postgres -d CMS \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;


docker run --name cms-db \
  -e POSTGRES_DB="CMS" \
  -e POSTGRES_PASSWORD="balaji" \
  -e POSTGRES_USER="postgres" \
  -v pgdata:/var/lib/postgresql/data \
  -p "5432:5432" \
  -d postgres:latest