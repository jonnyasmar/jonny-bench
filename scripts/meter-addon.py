import json
import os

FIELDS = (
    "promptTokenCount",
    "candidatesTokenCount",
    "thoughtsTokenCount",
    "cachedContentTokenCount",
    "totalTokenCount",
)


def response(flow):
    endpoint_match = os.environ.get("METER_ENDPOINT_MATCH", "")
    out_file = os.environ.get("METER_OUT", "")
    if not endpoint_match or not out_file:
        return
    if not os.path.isabs(out_file):
        return
    if endpoint_match not in flow.request.pretty_url:
        return

    try:
        body = flow.response.get_text(strict=False)
    except Exception:
        return
    if body is None:
        return

    for usage_metadata in usage_metadata_events(body):
        numeric = {
            key: value
            for key, value in usage_metadata.items()
            if key in FIELDS and isinstance(value, (int, float)) and not isinstance(value, bool)
        }
        if not numeric:
            continue
        os.makedirs(os.path.dirname(out_file), exist_ok=True)
        with open(out_file, "a", encoding="utf-8") as handle:
            handle.write(json.dumps({
                "responseId": flow.id,
                "usageMetadata": numeric,
            }, separators=(",", ":")) + "\n")


def usage_metadata_events(body):
    for payload in parse_payloads(body):
        yield from find_usage_metadata(payload)


def parse_payloads(body):
    saw_sse = False
    for line in body.splitlines():
        line = line.strip()
        if not line.startswith("data:"):
            continue
        saw_sse = True
        data = line[5:].strip()
        if not data or data == "[DONE]":
            continue
        try:
            yield json.loads(data)
        except json.JSONDecodeError:
            continue
    if saw_sse:
        return
    try:
        yield json.loads(body)
    except json.JSONDecodeError:
        return


def find_usage_metadata(value):
    if isinstance(value, dict):
        metadata = value.get("usageMetadata")
        if isinstance(metadata, dict):
            yield metadata
        for child in value.values():
            yield from find_usage_metadata(child)
    elif isinstance(value, list):
        for child in value:
            yield from find_usage_metadata(child)
