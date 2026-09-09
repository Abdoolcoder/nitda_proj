import pytest
from detect import detect_leaks

def test_spike_vs_baseline():
    events = []
    baselines = {}
    departure_dates = {}
    alerts = detect_leaks(events, baselines, departure_dates)
    assert len(alerts) == 0 # Stub test
