import pytest
import json
from exit_protocol import run_exit_protocol

def test_run_exit_protocol_carol():
    # Carol has mock data: projects and shares
    report = run_exit_protocol("carol")
    
    assert report["user"] == "carol"
    assert "project-gamma" in report["projects"]
    assert "revoked_access" in report["actions_taken"]
    assert "disabled_share" in report["actions_taken"]
    
    # Verify contract keys exist
    expected_keys = [
        "user", "projects", "files_accessed", 
        "external_shares_found", "actions_taken", "generated_at"
    ]
    for key in expected_keys:
        assert key in report

def test_run_exit_protocol_empty():
    # Unknown user should yield empty arrays but still succeed
    report = run_exit_protocol("unknown_user")
    
    assert report["user"] == "unknown_user"
    assert len(report["projects"]) == 0
    assert len(report["actions_taken"]) == 0
