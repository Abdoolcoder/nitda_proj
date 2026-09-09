import pytest
from exit_protocol import run_exit_protocol

def test_run_exit_protocol():
    report = run_exit_protocol("testuser")
    assert report["user"] == "testuser"
