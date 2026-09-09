# API Contract

## Activity Event
Consumed by leak-detection.

```json
{
  "user": "string",
  "action": "view | download | edit | share | delete",
  "file_path": "string",
  "project": "string",
  "timestamp": "ISO8601"
}
```

## Leak Alert
Produced by leak-detection, consumed by dashboard.

```json
{
  "user": "string",
  "rule_triggered": "spike_vs_baseline | burst_near_departure",
  "evidence": "string",
  "severity": "low | medium | high",
  "timestamp": "ISO8601"
}
```

## Exit Report
Produced by exit-protocol, consumed by dashboard.

```json
{
  "user": "string",
  "projects": ["string"],
  "files_accessed": ["string"],
  "external_shares_found": ["string"],
  "actions_taken": ["revoked_access", "transferred_ownership", "disabled_share"],
  "generated_at": "ISO8601"
}
```
