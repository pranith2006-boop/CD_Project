import sys, json

def generate_tac(tokens):
    tac = []
    i = 0
    n = len(tokens)
    t_count = 0
    
    while i < n:
        # Declaration with initialization: type name = expr;
        if i + 4 < n and tokens[i]['type'] == 'keyword' and tokens[i+1]['type'] == 'identifier' and tokens[i+2]['lexeme'] == '=':
            name = tokens[i+1]['lexeme']
            expr_tokens = []
            j = i + 3
            while j < n and tokens[j]['lexeme'] != ';':
                expr_tokens.append(tokens[j]['lexeme'])
                j += 1
            
            if len(expr_tokens) == 1:
                tac.append(f"{name} = {expr_tokens[0]}")
            else:
                expr_str = " ".join(expr_tokens)
                tac.append(f"t{t_count} = {expr_str}")
                tac.append(f"{name} = t{t_count}")
                t_count += 1
            i = j + 1 if j < n else n
            
        # Assignment: name = expr;
        elif i + 2 < n and tokens[i]['type'] == 'identifier' and tokens[i+1]['lexeme'] == '=':
            name = tokens[i]['lexeme']
            expr_tokens = []
            j = i + 2
            while j < n and tokens[j]['lexeme'] != ';':
                expr_tokens.append(tokens[j]['lexeme'])
                j += 1
            
            if len(expr_tokens) == 1:
                tac.append(f"{name} = {expr_tokens[0]}")
            else:
                expr_str = " ".join(expr_tokens)
                tac.append(f"t{t_count} = {expr_str}")
                tac.append(f"{name} = t{t_count}")
                t_count += 1
            i = j + 1 if j < n else n
            
        # Return statement: return expr;
        elif tokens[i]['lexeme'] == 'return':
            ret_tokens = []
            j = i + 1
            while j < n and tokens[j]['lexeme'] != ';':
                ret_tokens.append(tokens[j]['lexeme'])
                j += 1
            tac.append(f"return {' '.join(ret_tokens)}")
            i = j + 1 if j < n else n
        else:
            i += 1
            
    return tac

def main():
    data = sys.stdin.read()
    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
        
    tokens = payload.get('tokens', [])
    tac = generate_tac(tokens)
    print(json.dumps({"tac": tac}))

if __name__ == "__main__":
    main()
