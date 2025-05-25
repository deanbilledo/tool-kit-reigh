import subprocess
import os

def run_in_new_terminal(script_path):
    if os.name == 'nt':
        subprocess.Popen(['start', 'cmd', '/k', f'python {script_path}'], shell=True)
    else:
        print("This method is for Windows only.")

if __name__ == "__main__":
    # Change this path to your actual main.py path
    #put your main.py path here dont use mine use yours
    main_script = r"C:\Users\deanr\OneDrive\Documents\GitHub\tool-kit-reigh\tool-kit-reigh\main.py"
    run_in_new_terminal(main_script)
