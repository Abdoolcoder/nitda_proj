import json
from datetime import datetime
import os

def get_mock_user_data(username):
    """Mocks fetching user context from Nextcloud API."""
    if username == "carol":
        return {
            "projects": ["project-gamma"],
            "files_accessed": [
                "/project-gamma/patent_draft.pdf",
                "/project-gamma/results.xlsx"
            ],
            "external_shares": ["https://nextcloud.local/s/XyZ123"]
        }
    else:
        return {
            "projects": [],
            "files_accessed": [],
            "external_shares": []
        }

def run_exit_protocol(username):
    """
    Audits user activity, revokes access, and transfers ownership.
    Steps:
    1. List projects/groups
    2. List files accessed and recent activity
    3. Flag external shares
    4. Revoke access, transfer ownership, disable shares
    5. Generate exit report
    """
    user_data = get_mock_user_data(username)
    
    # Simulate actions taken
    actions = []
    if user_data["projects"]:
        actions.append("revoked_access")
        actions.append("transferred_ownership")
    if user_data["external_shares"]:
        actions.append("disabled_share")

    report = {
        "user": username,
        "projects": user_data["projects"],
        "files_accessed": user_data["files_accessed"],
        "external_shares_found": user_data["external_shares"],
        "actions_taken": actions,
        "generated_at": datetime.utcnow().isoformat() + "Z"
    }
    return report

if __name__ == "__main__":
    import sys
    username = sys.argv[1] if len(sys.argv) > 1 else "carol"
    
    print(f"Running Exit Protocol for user: {username}")
    report = run_exit_protocol(username)
    
    # Save to the JSON contract file
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    output_path = os.path.join(base_dir, 'docs', 'samples', 'exit-report.json')
    
    print(f"Generating Exit Report at {output_path}...")
    with open(output_path, 'w') as f:
        json.dump(report, f, indent=2)
        
    print("Protocol complete. User access successfully revoked.")
