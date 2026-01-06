#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}   PHP Configuration Helper           ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# 1. Check PHP
if ! command -v php &> /dev/null; then
    echo -e "${RED}Error: PHP is not installed or not in PATH.${NC}"
    echo "Please run ./install-env.sh first."
    exit 1
fi

# 2. Capture Password
echo -n "Enter your sudo password (for configuration): "
read -s SUDO_PASS
echo ""

# Validate password
echo -e "${BLUE}Validating password...${NC}"
echo "$SUDO_PASS" | sudo -S -v 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Incorrect password or no sudo privileges. Exiting.${NC}"
    exit 1
fi
echo -e "${GREEN}Password accepted.${NC}"

run_sudo() {
    echo "$SUDO_PASS" | sudo -S "$@"
}

# 3. Locate INI
INI_FILE=$(php -r "echo php_ini_loaded_file();")
if [ -z "$INI_FILE" ]; then
    echo -e "${RED}Error: Could not locate Loaded Configuration File.${NC}"
    exit 1
fi

echo -e "${BLUE}Found php.ini at:${NC} $INI_FILE"

# 4. Backup
BACKUP_FILE="${INI_FILE}.bak.$(date +%s)"
echo -n "Creating backup at $BACKUP_FILE... "
run_sudo cp "$INI_FILE" "$BACKUP_FILE"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Done.${NC}"
else
    echo -e "${RED}Failed to create backup.${NC}"
    exit 1
fi

# 5. Modify Settings
echo -e "${BLUE}Updating settings...${NC}"

update_setting() {
    local key=$1
    local value=$2
    echo "  Setting $key = $value"
    
    # sed pattern:
    # ^;*   : Start of line, optional semicolon (comment)
    # \s*   : Optional whitespace
    # KEY   : The setting name
    # \s*   : Optional whitespace
    # =     : Equals sign
    # .*    : Anything after
    # Replacement: KEY = VALUE
    
    # We use temporary file for sed to avoid complexity with -i on different systems (BSB vs GNU) sometimes,
    # but since this environment is Linux (Manjaro), standard -i is fine.
    # However, running sudo sed directly is tricky with quoting.
    # We will construct the command string.
    
    # Using | as delimiter to avoid path issues if any (not here, but good practice specific keys)
    run_sudo sed -i "s|^;*[[:space:]]*$key[[:space:]]*=.*|$key = $value|" "$INI_FILE"
}

update_setting "upload_max_filesize" "100M"
update_setting "post_max_size" "100M"
update_setting "memory_limit" "512M"

# 6. Verify
echo ""
echo -e "${BLUE}Verifying Changes:${NC}"
echo "--------------------------------"
CURRENT_UPLOAD=$(php -r "echo ini_get('upload_max_filesize');")
CURRENT_POST=$(php -r "echo ini_get('post_max_size');")
CURRENT_MEMORY=$(php -r "echo ini_get('memory_limit');")

echo "upload_max_filesize : $CURRENT_UPLOAD"
echo "post_max_size       : $CURRENT_POST"
echo "memory_limit        : $CURRENT_MEMORY"

# Simple Check
if [ "$CURRENT_UPLOAD" == "100M" ] && [ "$CURRENT_POST" == "100M" ] && [ "$CURRENT_MEMORY" == "512M" ]; then
    echo ""
    echo -e "${GREEN}Success! PHP Configuration updated.${NC}"
    
    # Restart check (Optional, depending on if user runs FPM)
    # On desktop dev (php artisan serve), changes are usually picked up on restart of serve.
    # On FPM (brew services), restart is needed.
    echo "Note: If you are running PHP-FPM or a web server service, remember to restart it."
    echo "      e.g., 'brew services restart php'"
else
    echo ""
    echo -e "${RED}Warning: Values might not match exactly or failed to update.${NC}"
fi
