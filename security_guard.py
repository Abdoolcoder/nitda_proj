import requests
import time
import argparse
import sys
from datetime import datetime

# Nextcloud Server Configuration
NC_URL = "http://localhost:8080"
NC_USER = "admin"
NC_PASS = "admin"
HEADERS = {"OCS-APIRequest": "true", "Accept": "application/json"}

# Hardcoded baselines for the prototype
USER_BASELINES = {
    "alice": {"avg_files_per_hour": 2, "departure_date": None},
    "bob": {"avg_files_per_hour": 5, "departure_date": None},
    "carol": {"avg_files_per_hour": 1, "departure_date": "2026-09-20T00:00:00Z"}
}

def lockdown_user(username):
    print(f"\n[!] INITIATING EXIT PROTOCOL FOR USER: {username}")
    url = f"{NC_URL}/ocs/v1.php/cloud/users/{username}/disable"
    try:
        response = requests.put(url, auth=(NC_USER, NC_PASS), headers=HEADERS)
        if response.status_code == 200:
            print(f"[*] SUCCESS: User '{username}' has been locked out of Nextcloud.")
        else:
            print(f"[x] FAILED to lock out user '{username}'. Ensure they exist in Nextcloud.")
    except Exception as e:
        print(f"[x] Connection Error: {e}")

def monitor_activity():
    print(f"[*] Starting Security Guard Monitoring on {NC_URL}...")
    print("[*] Watching for mass downloads and unauthorized external shares...\n")
    
    url = f"{NC_URL}/ocs/v2.php/apps/activity/api/v2/activity/all?format=json"
    
    # In a real daemon, we would loop with time.sleep(300).
    # For the hackathon demonstration, we just poll once.
    try:
        response = requests.get(url, auth=(NC_USER, NC_PASS), headers=HEADERS)
        if response.status_code != 200:
            print("[x] Error connecting to Nextcloud Activity API. Is the server running?")
            return
            
        activities = response.json().get('ocs', {}).get('data', [])
        if not activities:
            print("[-] No recent activity found in Nextcloud.")
            return

        print(f"[*] Analyzed {len(activities)} recent activity events.\n")
        
        # We will parse the activities and check our 3 rules.
        user_counts = {}
        for event in activities:
            user = event.get('user')
            action = event.get('type')  # e.g., 'file_download', 'file_shared'
            
            if not user or user not in USER_BASELINES:
                continue
                
            if action == 'file_shared' or 'share' in action.lower():
                print(f"[ALERT - HIGH] Unauthorized External Share Detected!")
                print(f"    User: {user}")
                print(f"    File: {event.get('subject')}")
                print(f"    Time: {event.get('datetime')}")
                print("-" * 50)
                continue
                
            if action in ['file_download', 'file_created', 'file_changed']:
                user_counts[user] = user_counts.get(user, 0) + 1

        # Check Spike vs Baseline
        for user, count in user_counts.items():
            baseline = USER_BASELINES[user]
            if count > baseline['avg_files_per_hour'] * 3:
                print(f"[ALERT - HIGH] Data Exfiltration Spike Detected!")
                print(f"    User: {user}")
                print(f"    Evidence: Accessed {count} files rapidly (Baseline is {baseline['avg_files_per_hour']}).")
                print("-" * 50)
                
            if baseline['departure_date'] and count >= 5:
                print(f"[ALERT - CRITICAL] Burst Activity Near Departure!")
                print(f"    User: {user}")
                print(f"    Evidence: Accessed >= 5 files within days of departure date ({baseline['departure_date']}).")
                print("-" * 50)

    except Exception as e:
        print(f"[x] Connection Error: {e}")
        print("[!] Ensure the Docker containers are running at http://localhost:8080")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Nextcloud Security Guard")
    parser.add_argument("--lockdown", type=str, help="Username to instantly lock out of Nextcloud")
    args = parser.parse_args()

    if args.lockdown:
        lockdown_user(args.lockdown)
    else:
        monitor_activity()
