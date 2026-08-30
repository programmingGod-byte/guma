import subprocess
import tempfile
import os

def run_code(code: str, stdin: str, language: str):
    try:
        if language == "python":
            with tempfile.NamedTemporaryFile(suffix=".py", delete=False, mode="w") as f:
                f.write(code)
                fname = f.name
            result = subprocess.run(
                ["python3", fname],
                input=stdin,
                capture_output=True,
                text=True,
                timeout=5
            )
            os.unlink(fname)
            return result.stdout.strip(), result.stderr.strip()
        
        elif language == "cpp":
            with tempfile.NamedTemporaryFile(suffix=".cpp", delete=False, mode="w") as f:
                f.write(code)
                fname = f.name
            
            exe_name = fname[:-4]
            # Compile
            compile_result = subprocess.run(
                ["g++", "-O2", fname, "-o", exe_name],
                capture_output=True,
                text=True
            )
            if compile_result.returncode != 0:
                os.unlink(fname)
                return None, compile_result.stderr.strip()
            
            # Execute
            try:
                result = subprocess.run(
                    [exe_name],
                    input=stdin,
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                stdout = result.stdout.strip()
                stderr = result.stderr.strip()
            finally:
                os.unlink(fname)
                if os.path.exists(exe_name):
                    os.unlink(exe_name)
                    
            return stdout, stderr

    except subprocess.TimeoutExpired:
        return None, "Time limit exceeded"
    except Exception as e:
        return None, str(e)

def judge_submission(code: str, language: str, test_cases: list):
    for tc in test_cases:
        stdout, stderr = run_code(code, tc["input"], language)
        if stderr:
            return "runtime_error"
        if stdout != tc["expected_output"].strip():
            return "wrong_answer"
    return "accepted"