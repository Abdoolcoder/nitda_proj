import pytest
from datetime import datetime, timedelta
from detect import detect_leaks

def generate_event(user, action, minutes_offset):
    base_time = datetime(2026, 9, 9, 10, 0, 0)
    event_time = base_time + timedelta(minutes=minutes_offset)
    return {
        "user": user,
        "action": action,
        "file_path": f"/project/doc_{minutes_offset}.pdf",
        "project": "proj",
        "timestamp": event_time.isoformat() + "Z"
    }

def test_spike_vs_baseline_trigger():
    # User baseline is 2. Threshold is 3x (6), but we have a min threshold of 3, so 6 it is.
    baselines = {"alice": 2}
    departure_dates = {}
    
    # 6 downloads in 1 hour should trigger it
    events = [generate_event("alice", "download", i) for i in range(6)]
    
    alerts = detect_leaks(events, baselines, departure_dates)
    assert len(alerts) == 1
    assert alerts[0]["rule_triggered"] == "spike_vs_baseline"
    assert alerts[0]["severity"] == "high"
    assert alerts[0]["user"] == "alice"
    assert "6 views/downloads" in alerts[0]["evidence"]

def test_spike_vs_baseline_normal():
    # User baseline is 5. Threshold is 15.
    baselines = {"bob": 5}
    departure_dates = {}
    
    # 10 downloads in 1 hour is normal (under 3x)
    events = [generate_event("bob", "view", i) for i in range(10)]
    
    alerts = detect_leaks(events, baselines, departure_dates)
    assert len(alerts) == 0

def test_burst_near_departure_trigger():
    baselines = {"carol": 10} # Baseline is high, so Spike rule won't trigger
    # Departure date is within 14 days of the events
    departure_dates = {"carol": "2026-09-12T00:00:00Z"} 
    
    # Burst of 5 files should trigger the departure rule
    events = [generate_event("carol", "download", i) for i in range(5)]
    
    alerts = detect_leaks(events, baselines, departure_dates)
    assert len(alerts) == 1
    assert alerts[0]["rule_triggered"] == "burst_near_departure"
    assert alerts[0]["severity"] == "high"
    assert alerts[0]["user"] == "carol"
    assert "5 files within 14 days" in alerts[0]["evidence"]

def test_burst_near_departure_normal():
    baselines = {"dave": 10}
    # Departure date is 30 days away (outside the 14 day window)
    departure_dates = {"dave": "2026-10-09T00:00:00Z"}
    
    events = [generate_event("dave", "download", i) for i in range(5)]
    
    alerts = detect_leaks(events, baselines, departure_dates)
    assert len(alerts) == 0

def test_ignore_other_actions():
    baselines = {"eve": 1}
    departure_dates = {}
    
    # Edit and share actions should not trigger exfiltration alerts
    events = []
    for i in range(10):
        events.append(generate_event("eve", "edit", i))
        events.append(generate_event("eve", "share", i+10))
        
    alerts = detect_leaks(events, baselines, departure_dates)
    assert len(alerts) == 0
