import json
from datetime import datetime, timedelta

def parse_iso8601(timestamp_str):
    """Parse an ISO8601 string to a datetime object, handling the 'Z' suffix."""
    if timestamp_str.endswith('Z'):
        timestamp_str = timestamp_str[:-1] + '+00:00'
    return datetime.fromisoformat(timestamp_str)

def detect_leaks(events, baselines, departure_dates):
    """
    Detect potential leaks based on activity events.
    Rules:
    1. Spike vs Baseline: Views/downloads in a short window (e.g. 1 hour) exceed historical baseline by 3x.
    2. Burst Near Departure: Burst of activity (>= 5 files) within 14 days of a known departure date.
    
    Inputs:
    - events: List of dictionaries representing activity events.
    - baselines: Dict mapping username to their daily average baseline count for views/downloads.
    - departure_dates: Dict mapping username to their departure date (ISO8601 string).
    """
    alerts = []
    
    # Sort events chronologically to process sequentially
    events = sorted(events, key=lambda e: e['timestamp'])
    
    # We will use a sliding window to track recent activity per user
    # recent_activity[user] = list of event timestamps
    recent_activity = {}
    
    # Configurable thresholds (reduced to catch more suspicious behavior for the demo)
    SPIKE_MULTIPLIER = 3
    DEPARTURE_WINDOW_DAYS = 14
    BURST_FILE_COUNT = 5
    SLIDING_WINDOW_HOURS = 1
    
    for event in events:
        user = event.get('user')
        action = event.get('action')
        timestamp_str = event.get('timestamp')
        
        if not user or not action or not timestamp_str:
            continue
            
        # We only care about data exfiltration actions: view, download
        if action not in ['view', 'download']:
            continue
            
        timestamp = parse_iso8601(timestamp_str)
        
        # Initialize user's recent activity tracking if not exists
        if user not in recent_activity:
            recent_activity[user] = []
            
        # Add current event
        recent_activity[user].append(timestamp)
        
        # Clean up old events outside the sliding window
        window_start = timestamp - timedelta(hours=SLIDING_WINDOW_HOURS)
        recent_activity[user] = [ts for ts in recent_activity[user] if ts >= window_start]
        
        current_window_count = len(recent_activity[user])
        
        # Rule 1: Spike vs Baseline
        baseline = baselines.get(user, 0)
        # We only trigger if the count strictly exceeds the baseline * multiplier
        # Ensure we have a minimum threshold to avoid alerting on tiny baselines (e.g. baseline 0 or 1)
        spike_threshold = max(baseline * SPIKE_MULTIPLIER, 3) 
        
        if current_window_count >= spike_threshold:
            alerts.append({
                "user": user,
                "rule_triggered": "spike_vs_baseline",
                "evidence": f"User performed {current_window_count} views/downloads in 1 hour. Baseline is {baseline}.",
                "severity": "high",
                "timestamp": timestamp_str
            })
            # Clear their activity to prevent spamming alerts for the same continuous burst
            recent_activity[user] = []
            continue # Don't double alert on the same event
            
        # Rule 2: Burst Near Departure
        departure_str = departure_dates.get(user)
        if departure_str:
            departure_date = parse_iso8601(departure_str)
            days_until_departure = (departure_date - timestamp).days
            
            # Check if event is within the departure window (e.g., 14 days before, or even slightly after)
            if -7 <= days_until_departure <= DEPARTURE_WINDOW_DAYS:
                if current_window_count >= BURST_FILE_COUNT:
                    alerts.append({
                        "user": user,
                        "rule_triggered": "burst_near_departure",
                        "evidence": f"User downloaded/viewed {current_window_count} files within {DEPARTURE_WINDOW_DAYS} days of departure date ({departure_str}).",
                        "severity": "high",
                        "timestamp": timestamp_str
                    })
                    # Clear their activity to prevent spamming
                    recent_activity[user] = []

    return alerts

if __name__ == "__main__":
    import os
    import json

    # Paths
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    input_path = os.path.join(base_dir, 'docs', 'samples', 'activity-log.json')
    output_path = os.path.join(base_dir, 'docs', 'samples', 'leak-alert.json')

    print(f"Loading mock data from {input_path}...")
    try:
        with open(input_path, 'r') as f:
            events = json.load(f)
    except Exception as e:
        print(f"Error loading {input_path}: {e}")
        events = []

    # Mock DB configurations for the prototype run
    # Normal user (bob) has high baseline, Spike user (alice) has low baseline
    baselines = {
        "alice": 1,
        "bob": 5,
        "carol": 10
    }
    
    # Carol departs within 14 days of the 2026-09-09 events
    departure_dates = {
        "carol": "2026-09-15T00:00:00Z"
    }

    print("Running detector engine...")
    alerts = detect_leaks(events, baselines, departure_dates)

    print(f"Generated {len(alerts)} alerts. Writing to {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(alerts, f, indent=2)

    print("Done. Please verify the output JSON matches the API contract.")
