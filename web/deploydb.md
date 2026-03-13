# Re-Deploying the Paypulse Database

Since your old database was deployed using `docker compose` and bound to a local volume mapping (`~/mongodb-docker/data`), you have to wipe out that old data folder. If you don't remove the old mapped data folder, Docker will just wake up the old database exactly as it was!

**To completely destroy the old database and establish the new Paypulse configuration securely with persistent storage, log into your GCP VM and run this command block:**

```bash
#!/bin/bash
set -e

# --- NEW CONFIGURATION ---
MONGO_PASSWORD="Thisis_admin1st1st"
MONGO_USER="admin"
MONGO_DB="paypulse"
# ---------------------

echo "🛑 Stopping and completely removing old database..."
cd ~/mongodb-docker

# Stop and remove the old docker-compose setup
sudo docker compose down 2>/dev/null || true
sudo docker rm -f mongodb-server 2>/dev/null || true

# CRITICAL: We MUST remove or rename the old persistent data folder.
# We will move it to a backup folder just in case, rather than permanently deleting.
echo "🗑️  Removing old persistent data to make room for the new db..."
sudo mv ~/mongodb-docker/data ~/mongodb-docker/old_data_backup_$(date +%s) 2>/dev/null || true

# Recreate the fresh empty data folder for the NEW persistent database
mkdir -p ~/mongodb-docker/data

echo "📝 Updating docker-compose.yml with new credentials..."
cat <<EOF > docker-compose.yml
services:
  mongodb:
    image: mongo:7.0
    container_name: mongodb-server
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DB}
    volumes:
      - ./data:/data/db
EOF

echo "🚀 Starting fresh new MongoDB container..."
sudo docker compose up -d

echo "--------------------------------------------------------"
sleep 5
echo "✅ NEW MongoDB Docker container ready!"
echo ""
echo "🔥 YOUR NEW CONNECTION STRING TO USE EVERYWHERE:"
echo "mongodb://$MONGO_USER:$MONGO_PASSWORD@34.9.202.173:27017/$MONGO_DB?authSource=admin"
echo "--------------------------------------------------------"
```

## Explanation:
1. **`sudo docker compose down`**: Shuts down the active script you ran previously.
2. **`sudo mv ~/mongodb-docker/data ~/mongodb-docker/old_data_backup...`**:  Moves the persistent database directory that holds your old "mydb" schema. This forces Mongo to spin up completely fresh.
3. **`docker compose up -d`**: Automatically utilizes the new `$MONGO_USER`, `$MONGO_PASSWORD`, and `$MONGO_DB` injected into the environment. 
4. **Persistent Storage:** Because of `- ./data:/data/db`, all data for "paypulse" will securely persist in `~/mongodb-docker/data` going forward even if the container crashes!
