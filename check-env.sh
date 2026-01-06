#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Symbols
CHECK_MARK="${GREEN}✔${NC}"
CROSS_MARK="${RED}✘${NC}"
WARNING_MARK="${YELLOW}⚠${NC}"

echo "============================================"
echo "   Laravel Environment Requirement Check"
echo "============================================"
echo ""

HAS_ERRORS=0

# Helper function to compare versions
version_gte() {
    [ "$1" = "$(echo -e "$1\n$2" | sort -V | head -n1)" ] && [ "$1" != "$2" ]
    return $? # 0 if $1 < $2 (fail), 1 if $1 >= $2 (pass) - wait, sort -V sorts ascending. 
    # if $1 is smallest, then $1 < $2. 
    # Logic: if lowest is $1, then $1 < $2 (assuming they are different).
    
    # Let's use a simpler awk approch for portability
    awk -v v1="$1" -v v2="$2" 'BEGIN {
        split(v1, a, "."); split(v2, b, ".");
        for (i=1; i<=3; i++) {
            if (a[i] + 0 > b[i] + 0) exit 0; # v1 > v2
            if (a[i] + 0 < b[i] + 0) exit 1; # v1 < v2
        }
        exit 0; # v1 == v2
    }'
}

# 1. Check Git
echo -n "Checking Git... "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo -e "${CHECK_MARK} Installed (v$GIT_VERSION)"
else
    echo -e "${CROSS_MARK} Not installed"
    echo -e "  ${YELLOW}Git is required for version control.${NC}"
    HAS_ERRORS=1
fi

# 2. Check Node.js (Req: >= 18)
REQUIRED_NODE_VERSION="18"
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2) # remove 'v' prefix
    
    # Simple major version check for Node is usually sufficient
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
    
    if [ "$NODE_MAJOR" -ge "$REQUIRED_NODE_VERSION" ]; then
        echo -e "${CHECK_MARK} Installed (v$NODE_VERSION) - Meets requirement (>= v$REQUIRED_NODE_VERSION)"
    else
        echo -e "${CROSS_MARK} Installed (v$NODE_VERSION)"
        echo -e "  ${RED}Error: Node.js version $REQUIRED_NODE_VERSION or higher is required.${NC}"
        HAS_ERRORS=1
    fi
else
    echo -e "${CROSS_MARK} Not installed"
    echo -e "  ${RED}Error: Node.js is required.${NC}"
    HAS_ERRORS=1
fi

# 3. Check NPM
echo -n "Checking NPM... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${CHECK_MARK} Installed (v$NPM_VERSION)"
else
    echo -e "${CROSS_MARK} Not installed"
    HAS_ERRORS=1
fi

# 4. Check PHP (Req: >= 8.2)
REQUIRED_PHP_VERSION="8.2"
echo -n "Checking PHP... "
if command -v php &> /dev/null; then
    PHP_VERSION=$(php -r 'echo PHP_VERSION;')
    
    # Use awk for float comparison safely
    if awk "BEGIN {exit !($PHP_VERSION >= $REQUIRED_PHP_VERSION)}"; then
        echo -e "${CHECK_MARK} Installed (v$PHP_VERSION) - Meets requirement (>= v$REQUIRED_PHP_VERSION)"
    else
        echo -e "${CROSS_MARK} Installed (v$PHP_VERSION)"
        echo -e "  ${RED}Error: PHP version $REQUIRED_PHP_VERSION or higher is required.${NC}"
        HAS_ERRORS=1
    fi
    
    # Check for common extensions if PHP is present
    echo "  Checking PHP Extensions:"
    REQUIRED_EXTENSIONS=("bcmath" "ctype" "curl" "dom" "fileinfo" "json" "mbstring" "openssl" "pcre" "pdo" "tokenizer" "xml")
    MISSING_EXT=0
    
    for ext in "${REQUIRED_EXTENSIONS[@]}"; do
        if php -m | grep -q -i "^$ext$"; then
             # Silent pass for brevity, or we can list them
             :
        else
            echo -e "    ${CROSS_MARK} Missing extension: $ext"
            MISSING_EXT=1
        fi
    done
    
    if [ $MISSING_EXT -eq 0 ]; then
        echo -e "    ${CHECK_MARK} All common Laravel extensions found."
    else
        echo -e "    ${RED}Some required PHP extensions are missing.${NC}"
        HAS_ERRORS=1
    fi

    # Check PHP Configuration
    echo "  Checking PHP Configuration:"
    
    # Helper to convert size to bytes for comparison
    to_bytes() {
        local value=$1
        case "$value" in
            *[Gg]*) echo $((${value%[Gg]*} * 1024 * 1024 * 1024)) ;;
            *[Mm]*) echo $((${value%[Mm]*} * 1024 * 1024)) ;;
            *[Kk]*) echo $((${value%[Kk]*} * 1024)) ;;
            *) echo $value ;;
        esac
    }

    check_config() {
        local setting=$1
        local required_human=$2
        local required_bytes=$(to_bytes $required_human)
        local current_human=$(php -r "echo ini_get('$setting');")
        local current_bytes=$(to_bytes $current_human)

        if [ "$current_bytes" -ge "$required_bytes" ]; then
            echo -e "    ${CHECK_MARK} $setting: $current_human (>= $required_human)"
        else
            echo -e "    ${CROSS_MARK} $setting: $current_human"
            echo -e "      ${RED}Error: $setting must be at least $required_human (Current: $current_human)${NC}"
            HAS_ERRORS=1
        fi
    }

    check_config "upload_max_filesize" "100M"
    check_config "post_max_size" "100M"
    check_config "memory_limit" "512M"

    # 6. Check Default Shell
    echo -n "Checking Default Shell... "
    if [ -n "$SHELL" ]; then
        echo -e "${CHECK_MARK} $SHELL"
    else
        echo -e "${WARNING_MARK} Could not determine default shell"
    fi

else
    echo -e "${CROSS_MARK} Not installed"
    echo -e "  ${RED}Error: PHP is required.${NC}"
    HAS_ERRORS=1
fi

# 5. Check Composer
echo -n "Checking Composer... "
if command -v composer &> /dev/null; then
    COMPOSER_VERSION=$(composer --version | awk '{print $3}')
    echo -e "${CHECK_MARK} Installed (v$COMPOSER_VERSION)"
else
    echo -e "${CROSS_MARK} Not installed"
    echo -e "  ${RED}Error: Composer is required.${NC}"
    HAS_ERRORS=1
fi

echo ""
echo "============================================"
if [ $HAS_ERRORS -eq 0 ]; then
    echo -e "${GREEN}SUCCESS! Your environment meets all requirements.${NC}"
    exit 0
else
    echo -e "${RED}FAILURE: Please fix the issues above before proceeding.${NC}"
    exit 1
fi
