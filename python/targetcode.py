import sys, json

def main():
    data = sys.stdin.read()
    try:
        payload = json.loads(data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)
        
    optimized_tac = payload.get('optimized_tac', [])
    assembly = []
    
    assembly.append("; --- Target Code Generation (x86_64) ---")
    assembly.append(".intel_syntax noprefix")
    assembly.append(".global main")
    assembly.append("main:")
    assembly.append("    push rbp")
    assembly.append("    mov rbp, rsp")
    assembly.append("    sub rsp, 16          ; Allocate stack frame")
    
    stack_offsets = {}
    next_offset = -4
    
    for line in optimized_tac:
        # Remove comment annotations from TAC line
        clean_line = line.split("//")[0].strip()
        if not clean_line:
            continue
            
        if " = " in clean_line:
            lhs, rhs = clean_line.split(" = ", 1)
            lhs = lhs.strip()
            rhs = rhs.strip()
            
            if lhs not in stack_offsets:
                stack_offsets[lhs] = next_offset
                next_offset -= 4
            lhs_offset = stack_offsets[lhs]
            
            if rhs.isdigit():
                assembly.append(f"    mov DWORD PTR [rbp{lhs_offset}], {rhs}   ; {lhs} = {rhs}")
            else:
                if rhs in stack_offsets:
                    rhs_offset = stack_offsets[rhs]
                    assembly.append(f"    mov eax, DWORD PTR [rbp{rhs_offset}]")
                    assembly.append(f"    mov DWORD PTR [rbp{lhs_offset}], eax   ; {lhs} = {rhs}")
                elif "+" in rhs or "-" in rhs or "*" in rhs or "/" in rhs:
                    parts = rhs.split()
                    if len(parts) == 3:
                        op1, op, op2 = parts
                        
                        # Load Operand 1
                        if op1.isdigit():
                            assembly.append(f"    mov eax, {op1}")
                        elif op1 in stack_offsets:
                            assembly.append(f"    mov eax, DWORD PTR [rbp{stack_offsets[op1]}]")
                        else:
                            assembly.append(f"    mov eax, 0")
                            
                        # Apply Operator and Operand 2
                        if op == "+":
                            if op2.isdigit():
                                assembly.append(f"    add eax, {op2}")
                            elif op2 in stack_offsets:
                                assembly.append(f"    add eax, DWORD PTR [rbp{stack_offsets[op2]}]")
                        elif op == "-":
                            if op2.isdigit():
                                assembly.append(f"    sub eax, {op2}")
                            elif op2 in stack_offsets:
                                assembly.append(f"    sub eax, DWORD PTR [rbp{stack_offsets[op2]}]")
                        elif op == "*":
                            if op2.isdigit():
                                assembly.append(f"    imul eax, {op2}")
                            elif op2 in stack_offsets:
                                assembly.append(f"    imul eax, DWORD PTR [rbp{stack_offsets[op2]}]")
                                
                        # Save result to LHS variable
                        assembly.append(f"    mov DWORD PTR [rbp{lhs_offset}], eax   ; {lhs} = {rhs}")
                else:
                    assembly.append(f"    mov DWORD PTR [rbp{lhs_offset}], 0")
                    
        elif clean_line.startswith("return "):
            val = clean_line.split("return ", 1)[1].strip()
            if val.isdigit():
                assembly.append(f"    mov eax, {val}         ; Return literal")
            elif val in stack_offsets:
                val_offset = stack_offsets[val]
                assembly.append(f"    mov eax, DWORD PTR [rbp{val_offset}]   ; Load return variable")
            else:
                assembly.append(f"    mov eax, 0")
            assembly.append("    leave")
            assembly.append("    ret                  ; Return from function")
            
    if not any(x.startswith("return ") for x in optimized_tac):
        assembly.append("    mov eax, 0           ; Default return 0")
        assembly.append("    leave")
        assembly.append("    ret")
        
    print(json.dumps({"assembly": assembly}))

if __name__ == "__main__":
    main()
