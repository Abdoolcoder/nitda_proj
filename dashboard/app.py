import os
import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def load_json(filename):
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    path = os.path.join(base_dir, 'docs', 'samples', filename)
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return [] if filename != 'exit-report.json' else {}

@app.route('/')
def index():
    # Load data from the API contracts
    activity_log = load_json('activity-log.json')
    leak_alerts = load_json('leak-alert.json')
    shares = load_json('external-shares.json')
    
    return render_template('index.html', 
                           activities=activity_log, 
                           alerts=leak_alerts, 
                           shares=shares)

@app.route('/api/trigger_exit', methods=['POST'])
def trigger_exit():
    # In a real app, this would execute exit_protocol.py
    # Here, we just return the pre-generated exit-report.json
    report = load_json('exit-report.json')
    return jsonify({"status": "success", "report": report})

@app.route('/api/create_share', methods=['POST'])
def create_share():
    data = request.json
    shares = load_json('external-shares.json')
    if not isinstance(shares, list):
        shares = []
    shares.append({
        "file": data.get('file'),
        "recipient": data.get('recipient'),
        "expiry": data.get('expiry')
    })
    
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    path = os.path.join(base_dir, 'docs', 'samples', 'external-shares.json')
    with open(path, 'w') as f:
        json.dump(shares, f, indent=2)
        
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
