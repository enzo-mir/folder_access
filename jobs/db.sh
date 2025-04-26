#!/bin/bash

# Job configuration
JOB_NAME="RefreshDatabase"
QUEUE_NAME="database_refresh"
LOG_FILE="~/cronlogs/logs.log"

# Logging function
log() {
    local level=$1
    local message=$2
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message" >> "$LOG_FILE"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $message"
}

# Main function
perform() {
    log "INFO" "Starting database refresh job..."
    
    # Run migrations
    output=$(cd ~/htdocs/access.enzomrg.com/build && node ace migration:fresh --force && rm -rf ./storage -r 2>&1)
    status=$?
    
       log "INFO" "Clean directories..."

    
    if [ $status -ne 0 ]; then
        log "ERROR" "Database refresh failed:"
        log "ERROR" "$output"
        return 1
    else
        log "INFO" "Database refreshed successfully."
        log "INFO" "$output"
        return 0
    fi
}

# Handle failure (simple version)
on_failure() {
    log "ERROR" "Job failed: $1"
    # Add any failure handling logic here
}

# Main execution
if perform; then
    log "INFO" "Job completed successfully"
else
    on_failure "$output"
    exit 1
fi