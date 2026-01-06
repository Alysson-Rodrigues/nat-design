#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}   Laravel Environment Installer      ${NC}"
echo -e "${BLUE}=======================================${NC}"
echo ""

# 1. Capture Password
echo -n "Enter your sudo password (for installation): "
read -s SUDO_PASS
echo ""

# Validate password implies basic sudo access
echo -e "${BLUE}Validating password...${NC}"
echo "$SUDO_PASS" | sudo -S -v 2>/dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Incorrect password or no sudo privileges. Exiting.${NC}"
    exit 1
fi
echo -e "${GREEN}Password accepted.${NC}"

# Helper to run commands with sudo
run_sudo() {
    echo "$SUDO_PASS" | sudo -S "$@"
}

# 2. Check/Install Homebrew
echo ""
echo -e "${BLUE}Checking Homebrew...${NC}"

if ! command -v brew &> /dev/null; then
    echo "Homebrew not found. Installing..."
    
    # Official Non-interactive install (setting NONINTERACTIVE=1)
    # We pipe echoing enter just in case, but NONINTERACTIVE should handle it
    NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Determine Correct Bin Path (Linux usually /home/linuxbrew/.linuxbrew/bin/brew)
    BREW_BIN="/home/linuxbrew/.linuxbrew/bin/brew"
    
    if [ -f "$BREW_BIN" ]; then
        echo -e "${GREEN}Homebrew installed successfully.${NC}"
        
        # 3. Configure Shell
        echo -e "${BLUE}Configuring Shell Environment...${NC}"
        
        SHELL_CMD="eval \"\$($BREW_BIN shellenv)\""
        RC_FILE=""
        
        if [[ "$SHELL" == *"zsh"* ]]; then
            RC_FILE="$HOME/.zshrc"
        elif [[ "$SHELL" == *"bash"* ]]; then
            RC_FILE="$HOME/.bashrc"
        fi
        
        if [ -n "$RC_FILE" ]; then
             if ! grep -q "brew shellenv" "$RC_FILE"; then
                 echo "$SHELL_CMD" >> "$RC_FILE"
                 echo -e "${GREEN}Added Homebrew config to $RC_FILE${NC}"
             else
                 echo "Config already present in $RC_FILE"
             fi
        fi
        
        # Load into current session so we can us it immediately
        eval "$($BREW_BIN shellenv)"
        
    else
        echo -e "${RED}Homebrew installation appeared to complete but binary not found at $BREW_BIN${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}Homebrew is already installed.${NC}"
fi

# 4. Install Packages (PHP & Composer)
echo ""
echo -e "${BLUE}Installing Packages...${NC}"

echo "Installing PHP..."
brew install php

echo "Installing Composer..."
brew install composer

echo ""
echo -e "${GREEN}Installation Complete!${NC}"
echo "Please restart your terminal or run 'source ~/.zshrc' (or ~/.bashrc) to ensure changes take effect."
