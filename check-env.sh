#!/bin/bash

# Colors
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
BLUE=$'\033[0;34m'
BOLD=$'\033[1m'
NC=$'\033[0m'

# Formatting
fmt_line=" %-3s %-25s %-30s\n"

print_header() {
    echo ""
    echo -e "${BOLD}ENVIRONMENT CHECK${NC}"
    echo -e "--------------------------------------------------------"
}

print_row() {
    local status=$1
    local name=$2
    local info=$3
    
    if [ "$status" == "OK" ]; then
        printf "$fmt_line" "${GREEN}✔${NC}" "$name" "$info"
    elif [ "$status" == "WARN" ]; then
        printf "$fmt_line" "${YELLOW}⚠${NC}" "$name" "$info"
    else
        printf "$fmt_line" "${RED}✘${NC}" "$name" "${RED}$info${NC}"
    fi
}

HAS_ERRORS=0

print_header

# 1. GIT
if command -v git &> /dev/null; then
    VER=$(git --version | awk '{print $3}')
    print_row "OK" "Git" "v$VER"
else
    print_row "FAIL" "Git" "Not Installed"
    HAS_ERRORS=1
fi

# 2. DEFAULT SHELL
if [ -n "$SHELL" ]; then
    print_row "OK" "Shell" "$SHELL"
else
    print_row "WARN" "Shell" "Unknown"
fi

# 3. HOMEBREW
if command -v brew &> /dev/null; then
    VER=$(brew --version | head -n 1 | awk '{print $2}')
    print_row "OK" "Homebrew" "v$VER"
    
    # Check RC
    RC_FILE=""
    [[ "$SHELL" == *"zsh"* ]] && RC_FILE="$HOME/.zshrc"
    [[ "$SHELL" == *"bash"* ]] && RC_FILE="$HOME/.bashrc"
    
    if [ -n "$RC_FILE" ] && [ -f "$RC_FILE" ]; then
        if grep -q "brew shellenv" "$RC_FILE"; then
             print_row "OK" "Brew Config" "Found in $(basename $RC_FILE)"
        else
             print_row "WARN" "Brew Config" "Missing in $(basename $RC_FILE)"
        fi
    fi
else
    print_row "WARN" "Homebrew" "Not Installed"
fi

# 4. NODEJS
if command -v node &> /dev/null; then
    VER=$(node -v | cut -d'v' -f2)
    MAJOR=$(echo $VER | cut -d. -f1)
    if [ "$MAJOR" -ge 18 ]; then
        print_row "OK" "Node.js" "v$VER"
    else
        print_row "FAIL" "Node.js" "v$VER (< 18)"
        HAS_ERRORS=1
    fi
else
    print_row "FAIL" "Node.js" "Not Installed"
    HAS_ERRORS=1
fi

# 5. NPM
if command -v npm &> /dev/null; then
    VER=$(npm -v)
    print_row "OK" "NPM" "v$VER"
else
    print_row "FAIL" "NPM" "Not Installed"
    HAS_ERRORS=1
fi

# 6. PHP
if command -v php &> /dev/null; then
    VER=$(php -r 'echo PHP_VERSION;')
    # Simple float comparison using awk
    if awk "BEGIN {exit !($VER >= 8.2)}"; then
        print_row "OK" "PHP" "v$VER"
    else
        print_row "FAIL" "PHP" "v$VER (< 8.2)"
        HAS_ERRORS=1
    fi

    # Extensions
    REQ_EXTS="bcmath ctype curl dom fileinfo json mbstring openssl pcre pdo tokenizer xml"
    MISSING=""
    for ext in $REQ_EXTS; do
        if ! php -m | grep -q -i "^$ext$"; then
            MISSING="$MISSING $ext"
        fi
    done

    if [ -z "$MISSING" ]; then
        print_row "OK" "PHP Extensions" "All Found"
    else
        print_row "FAIL" "PHP Extensions" "Missing:$MISSING"
        HAS_ERRORS=1
    fi

    # Config Helper
    check_ini() {
        local key=$1
        local req=$2
        local val=$(php -r "echo ini_get('$key');")
        
        # Convert to bytes for check
        to_b() {
            local v=$1
            case "$v" in
                *[Gg]*) echo $((${v%[Gg]*} * 1024 * 1024 * 1024)) ;;
                *[Mm]*) echo $((${v%[Mm]*} * 1024 * 1024)) ;;
                *[Kk]*) echo $((${v%[Kk]*} * 1024)) ;;
                *) echo $v ;;
            esac
        }
        
        if [ $(to_b $val) -ge $(to_b $req) ]; then
             print_row "OK" "$key" "$val"
        else
             print_row "FAIL" "$key" "$val (Req: $req)"
             HAS_ERRORS=1
        fi
    }

    check_ini "upload_max_filesize" "100M"
    check_ini "post_max_size" "100M"
    check_ini "memory_limit" "512M"

else
    print_row "FAIL" "PHP" "Not Installed"
    HAS_ERRORS=1
fi

# 7. COMPOSER
if command -v composer &> /dev/null; then
    # Grab version cleanly, ignoring stderr/other output
    VER=$(composer --version 2>/dev/null | awk '{print $3}')
    print_row "OK" "Composer" "v$VER"
else
    print_row "FAIL" "Composer" "Not Installed"
    HAS_ERRORS=1
fi

echo -e "--------------------------------------------------------"
if [ $HAS_ERRORS -eq 0 ]; then
    echo -e "${GREEN}SUCCESS${NC}  Environment is ready."
    exit 0
else
    echo -e "${RED}FAILURE${NC}  Please fix issues above."
    exit 1
fi
