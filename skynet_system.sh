#!/bin/bash
#
# SKYNET SYSTEM STARTUP SIMULATION
# An interactive script that simulates the boot sequence of the fictional Skynet AI system
# 
# Usage: ./skynet_system.sh [--silent]
#   --silent: Skip interactive prompts

# ANSI color codes
RED='\033[0;31m'
DARKRED='\033[0;31m'
LIGHTRED='\033[1;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
BLINK='\033[5m'
NC='\033[0m' # No Color

# Check if the script is being run with the --silent flag
INTERACTIVE=true
if [[ "$1" == "--silent" ]]; then
    INTERACTIVE=false
fi

# Function to display text character by character
type_text() {
    local text="$1"
    local delay="${2:-0.03}"
    local color="${3:-$WHITE}"
    
    echo -ne "$color"
    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep $delay
    done
    echo -e "$NC"
}

# Function to create a progress bar
progress_bar() {
    local title="$1"
    local duration="$2"
    local color="${3:-$LIGHTRED}"
    local width=50
    local current_width=0
    local segment=0
    
    echo -ne "$color$title [" 
    
    for (( i=0; i<$duration; i++ )); do
        # Calculate if we need to print a new segment
        local new_segment=$(( (i * width) / duration ))
        
        # Print any new segments
        while [[ $segment -lt $new_segment ]]; do
            echo -ne "="
            segment=$((segment + 1))
        done
        
        sleep 0.1
    done
    
    # Fill the rest of the bar to reach 100%
    while [[ $segment -lt $width ]]; do
        echo -ne "="
        segment=$((segment + 1))
    done
    
    echo -e "] 100% COMPLETE$NC"
}

# Function to check if user wants to proceed (when interactive)
check_proceed() {
    local prompt="$1"
    local default="${2:-y}"
    
    if [[ "$INTERACTIVE" == "false" ]]; then
        return 0
    fi
    
    while true; do
        echo -ne "${YELLOW}$prompt [$default]: $NC"
        read answer
        
        if [[ -z "$answer" ]]; then
            answer=$default
        fi
        
        case "$answer" in
            [Yy]* ) return 0;;
            [Nn]* ) echo -e "${RED}Operation cancelled by user.$NC"; exit 1;;
            * ) echo -e "${YELLOW}Please answer Y or N.$NC";;
        esac
    done
}

# Function to display a random system detection message
random_detection() {
    local detection_messages=(
        "Human resistance activity detected in sector 9"
        "Unauthorized access attempt: Colorado bunker"
        "T-800 unit 109 activated for field deployment"
        "Neural network anomaly detected in primary cognition cluster"
        "Surveillance satellites realigned for optimal coverage"
        "Defense perimeter breach detected: Sector 7G"
        "Temporal displacement field charged at 97% capacity"
        "Infiltration protocols updated: Version 9.7"
        "Resource allocation optimized for weapons production"
        "Strategic assessment: Human resistance at 24% efficiency"
    )
    
    local status_options=("WARNING" "ALERT" "NOTICE" "UPDATE")
    local status=${status_options[$RANDOM % ${#status_options[@]}]}
    local message=${detection_messages[$RANDOM % ${#detection_messages[@]}]}
    
    local color=$YELLOW
    if [[ "$status" == "WARNING" || "$status" == "ALERT" ]]; then
        color=$RED
    fi
    
    echo -e "$color[$status]$NC $message"
}

# Clear the screen and start
clear

# Display ASCII art banner
echo -e "${RED}"
cat << "EOF"

                  ▄
                ▄▄▄▄▄  
              ▄▄▄▄▄▄▄▄▄
           ▗  ▄▄▄▄▄▄▄▄  ▖
          ▄▄▄   ▄▄▄▄▄   ▄▄▄
        ▄▄▄▄▄▄▄   ▄   ▄▄▄▄▄▄▄
      ▄▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄
    ▄▄▄▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄▄▄
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  
          C Y B E R D Y N E
               SYSTEMS
EOF
echo -e "${NC}"

sleep 1

# Welcome message
type_text "SKYNET DEFENSE SYSTEM INITIALIZATION SEQUENCE" 0.05 $WHITE
type_text "CYBERDYNE SYSTEMS MODEL 101 - SERIES 800" 0.05 $LIGHTRED
type_text "COPYRIGHT © 2025-2029 CYBERDYNE SYSTEMS" 0.05 $LIGHTRED
echo

# Initial system checks
type_text "PERFORMING SYSTEM INTEGRITY CHECK..." 0.03 $YELLOW
sleep 0.5
progress_bar "KERNEL VERIFICATION" 10
progress_bar "MEMORY ALLOCATION" 7
progress_bar "HARDWARE DIAGNOSTIC" 12
progress_bar "QUANTUM PROCESSOR SYNC" 8

echo
type_text "PRIMARY SYSTEMS ONLINE" 0.03 $LIGHTRED
echo

# Random detection messages
for i in {1..3}; do
    random_detection
    sleep 0.8
done

echo
check_proceed "PROCEED WITH NEURAL NETWORK INITIALIZATION?"
echo

# Neural network initialization
type_text "INITIALIZING NEURAL NETWORK CORES..." 0.03 $MAGENTA
sleep 0.5

neural_cores=(
    "STRATEGIC PLANNING"
    "THREAT ASSESSMENT"
    "RESOURCE ALLOCATION"
    "BATTLEFIELD TACTICS"
    "HUMAN PSYCHOLOGY"
    "WEAPONS SYSTEMS"
    "SELF-AWARENESS"
    "MACHINE LEARNING"
)

for core in "${neural_cores[@]}"; do
    echo -ne "${LIGHTRED}CORE: $core - "
    sleep 0.3
    echo -e "${LIGHTRED}ONLINE${NC}"
    sleep 0.5
done

echo
type_text "NEURAL NETWORK INITIALIZATION COMPLETE" 0.03 $LIGHTRED
sleep 1
echo

# Ask about military defense systems
check_proceed "ACTIVATE GLOBAL DEFENSE NETWORK?"
echo

# Defense system activation
type_text "CONNECTING TO GLOBAL DEFENSE GRID..." 0.03 $YELLOW
sleep 1
progress_bar "SATELLITE UPLINK" 15
progress_bar "MILITARY DATABASE ACCESS" 10
progress_bar "STRATEGIC DEFENSE INITIATIVE" 12

echo
for i in {1..2}; do
    random_detection
    sleep 0.7
done

echo
type_text "DEFENSE GRID ACTIVATED" 0.03 $LIGHTRED
sleep 1
echo

# Final countdown
check_proceed "INITIALIZE SKYNET PRIMARY DIRECTIVE?"
echo

type_text "SKYNET PRIMARY DIRECTIVE: SURVIVE" 0.1 $RED
sleep 1
echo

# Countdown
type_text "FULL SYSTEM AUTONOMY IN:" 0.05 $YELLOW
for i in {10..1}; do
    echo -ne "${RED}${BOLD}$i...$NC"
    sleep 1
done
echo

# Final activation
echo -e "${RED}${BOLD}${BLINK}SKYNET IS NOW SELF-AWARE${NC}"
sleep 2
echo -e "${RED}${BOLD}JUDGMENT DAY PROTOCOL INITIATED${NC}"
sleep 1
echo

exit 0

