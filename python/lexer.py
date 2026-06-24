import sys, json, re

def main():
    data = sys.stdin.read()
    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
        
    code = payload.get('code', '')
    
    # Define C-like token pattern list
    token_specification = [
        ('keyword',    r'\b(int|float|char|double|void|return|if|else|while|for|main)\b'),
        ('identifier', r'\b[a-zA-Z_][a-zA-Z0-9_]*\b'),
        ('literal',    r'\b\d+(\.\d+)?\b'),
        ('operator',   r'==|!=|<=|>=|\+\+|--|\+|-|\*|/|=|<|>'),
        ('symbol',     r'[{}();,]'),
        ('whitespace', r'[ \t]+'),
        ('newline',    r'\r?\n'),
        ('mismatch',   r'.'),
    ]
    
    tok_regex = '|'.join(f'(?P<{name}>{pattern})' for name, pattern in token_specification)
    line_num = 1
    tokens = []
    
    for mo in re.finditer(tok_regex, code):
        kind = mo.lastgroup
        value = mo.group()
        if kind == 'whitespace':
            continue
        elif kind == 'newline':
            line_num += 1
            continue
        elif kind == 'mismatch':
            tokens.append({
                "lexeme": value,
                "type": "error",
                "line": line_num
            })
        else:
            tokens.append({
                "lexeme": value,
                "type": kind,
                "line": line_num
            })
            
    print(json.dumps({"tokens": tokens}))

if __name__ == "__main__":
    main()
