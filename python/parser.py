import sys, json

def parse_program(tokens):
    nodes = []
    i = 0
    n = len(tokens)
    
    while i < n:
        # Check function declaration: type identifier ( ) {
        if i + 5 < n and tokens[i]['type'] == 'keyword' and tokens[i+1]['type'] == 'identifier' and tokens[i+2]['lexeme'] == '(' and tokens[i+3]['lexeme'] == ')' and tokens[i+4]['lexeme'] == '{':
            fun_name = tokens[i+1]['lexeme']
            fun_type = tokens[i]['lexeme']
            body_tokens = []
            brace_count = 1
            i += 5
            while i < n and brace_count > 0:
                if tokens[i]['lexeme'] == '{':
                    brace_count += 1
                elif tokens[i]['lexeme'] == '}':
                    brace_count -= 1
                if brace_count > 0:
                    body_tokens.append(tokens[i])
                i += 1
            
            # Parse body statements
            body_statements = parse_statements(body_tokens)
            
            nodes.append({
                "type": "FunctionDeclaration",
                "lexeme": fun_name,
                "children": [
                    {"type": "ReturnType", "lexeme": fun_type},
                    {"type": "Block", "children": body_statements}
                ]
            })
        else:
            # Fallback for single statements outside function
            stmt_tokens = []
            while i < n and tokens[i]['lexeme'] != ';':
                stmt_tokens.append(tokens[i])
                i += 1
            if i < n:
                stmt_tokens.append(tokens[i])
                i += 1
            if stmt_tokens:
                nodes.append({
                    "type": "ExpressionStatement",
                    "lexeme": " ".join(t['lexeme'] for t in stmt_tokens)
                })
            else:
                i += 1
            
    return {"type": "Program", "children": nodes}

def parse_statements(tokens):
    statements = []
    i = 0
    n = len(tokens)
    
    while i < n:
        # Variable Declaration with Initialization: type name = val;
        if i + 4 < n and tokens[i]['type'] == 'keyword' and tokens[i+1]['type'] == 'identifier' and tokens[i+2]['lexeme'] == '=':
            # Find semicolon
            val_tokens = []
            j = i + 3
            while j < n and tokens[j]['lexeme'] != ';':
                val_tokens.append(tokens[j]['lexeme'])
                j += 1
            statements.append({
                "type": "VariableDeclaration",
                "lexeme": tokens[i+1]['lexeme'],
                "children": [
                    {"type": "Type", "lexeme": tokens[i]['lexeme']},
                    {"type": "Initializer", "lexeme": " ".join(val_tokens)}
                ]
            })
            i = j + 1 if j < n else n
            
        # Return statement: return expr;
        elif tokens[i]['lexeme'] == 'return':
            ret_tokens = []
            j = i + 1
            while j < n and tokens[j]['lexeme'] != ';':
                ret_tokens.append(tokens[j]['lexeme'])
                j += 1
            statements.append({
                "type": "ReturnStatement",
                "children": [
                    {"type": "Expression", "lexeme": " ".join(ret_tokens)}
                ]
            })
            i = j + 1 if j < n else n
            
        # Assignment: identifier = expr;
        elif i + 2 < n and tokens[i]['type'] == 'identifier' and tokens[i+1]['lexeme'] == '=':
            expr_tokens = []
            j = i + 2
            while j < n and tokens[j]['lexeme'] != ';':
                expr_tokens.append(tokens[j]['lexeme'])
                j += 1
            statements.append({
                "type": "AssignmentStatement",
                "lexeme": tokens[i]['lexeme'],
                "children": [
                    {"type": "Expression", "lexeme": " ".join(expr_tokens)}
                ]
            })
            i = j + 1 if j < n else n
            
        # Generic statement fallback
        else:
            stmt_tokens = []
            while i < n and tokens[i]['lexeme'] != ';':
                stmt_tokens.append(tokens[i]['lexeme'])
                i += 1
            if i < n:
                stmt_tokens.append(tokens[i]['lexeme'])
                i += 1
            if stmt_tokens:
                statements.append({
                    "type": "Statement",
                    "lexeme": " ".join(stmt_tokens)
                })
            else:
                i += 1
                
    return statements

def main():
    data = sys.stdin.read()
    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
        
    tokens = payload.get('tokens', [])
    parse_tree = parse_program(tokens)
    print(json.dumps({"parse_tree": parse_tree}))

if __name__ == "__main__":
    main()
