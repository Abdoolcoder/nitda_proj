import subprocess
import json

def get_shares():
    try:
        # Query MariaDB directly to find all public links (share_type=3)
        cmd = 'docker compose exec db mysql -u nextcloud -psecret nextcloud -e "SELECT file_target, uid_owner, expiration, token FROM oc_share WHERE share_type=3;"'
        result = subprocess.run(cmd, cwd="../infra", shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output = result.stdout.decode('utf-8').strip()
        
        shares = []
        if output:
            lines = output.split('\n')
            # Skip the header row
            if len(lines) > 1:
                for line in lines[1:]:
                    parts = line.split('\t')
                    if len(parts) >= 4:
                        shares.append({
                            "file": parts[0].strip().split('/')[-1],  # Extract just the filename
                            "owner": parts[1].strip(),
                            "expiration": parts[2].strip() if parts[2].strip() != "NULL" else "No Expiration",
                            "token": parts[3].strip(),
                            "url": f"http://localhost:8080/s/{parts[3].strip()}"
                        })
        print(json.dumps(shares))
    except Exception as e:
        print(json.dumps([]))

if __name__ == "__main__":
    get_shares()
