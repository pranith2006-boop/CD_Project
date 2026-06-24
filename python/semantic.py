import sys, json

def main():
    data = sys.stdin.read()
    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
    # Simple semantic check: ensure code is non‑empty
    code = payload.get('code', '')
    result = {
        "semantic": {
            "status": "ok" if code.strip() else "empty",
            "issues": []
        }
    }
    print(json.dumps(result))

if __name__ == "__main__":
    main()
