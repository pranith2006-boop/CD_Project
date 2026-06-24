import sys, json, re

def main():
    data = sys.stdin.read()
    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
        
    tac = payload.get('tac', [])
    optimized_tac = []
    constants = {}
    
    for line in tac:
        if " = " in line:
            lhs, rhs = line.split(" = ", 1)
            lhs = lhs.strip()
            rhs = rhs.strip()
            
            # Constant Propagation: Replace variables in RHS with their known constant values
            for var, val in constants.items():
                rhs = re.sub(rf'\b{var}\b', str(val), rhs)
                
            # Constant Folding: Evaluate binary expressions of constants
            if re.match(r'^\d+(\.\d+)?\s*[\+\-\*/%]\s*\d+(\.\d+)?$', rhs):
                try:
                    val = eval(rhs)
                    if isinstance(val, float) and val.is_integer():
                        val = int(val)
                    optimized_tac.append(f"{lhs} = {val}  // Folded '{rhs}'")
                    constants[lhs] = val
                except:
                    optimized_tac.append(f"{lhs} = {rhs}")
            else:
                # Check if it is now a single literal value
                if re.match(r'^\d+(\.\d+)?$', rhs):
                    try:
                        val = eval(rhs)
                        if isinstance(val, float) and val.is_integer():
                            val = int(val)
                        optimized_tac.append(f"{lhs} = {val}")
                        constants[lhs] = val
                    except:
                        optimized_tac.append(f"{lhs} = {rhs}")
                else:
                    optimized_tac.append(f"{lhs} = {rhs}")
        else:
            # Propagate values to statements like return
            for var, val in constants.items():
                line = re.sub(rf'\b{var}\b', str(val), line)
            optimized_tac.append(line)
            
    print(json.dumps({"optimized_tac": optimized_tac}))

if __name__ == "__main__":
    main()
