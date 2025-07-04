import os 
import sys
import re
import json

FILE_PATH = 'json/list-regex.json'
def get_patterns_id(id):
    with open(FILE_PATH, 'r') as f:
        patterns = json.load(f)
        return patterns.get('list_regex', [])[id-1].get('pattern') if id > 0 else patterns.get('list_regex', [])[0].get('pattern')

def read_files(patterns):
    if not os.path.isdir("extracted") or not os.listdir("extracted"):
        print("Extracted folder is empty or does not exist")
        return

    results = {}

    for root, _, files in os.walk("extracted"):
        if "vendor" in root.split(os.sep):
            continue

        # Ambil nama plugin hanya dari folder pertama setelah 'extracted'
        relative_path = os.path.relpath(root, "extracted")
        plugin_name = relative_path.split(os.sep)[0]  # Ambil folder pertama

        if plugin_name not in results:
            results[plugin_name] = []

        for file in files:
            if file.endswith(".php"):
                file_path = os.path.abspath(os.path.join(root, file)).replace("\\", "/")

                try:
                    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                        for num, line in enumerate(f, 1):
                            for regex in patterns:
                                try:
                                    if re.search(regex, line, re.IGNORECASE):
                                        results[plugin_name].append({
                                            "floc": file_path,
                                            "line": num,
                                            "detail": line.strip()
                                        })
                                except re.error as e:
                                    print(f"Regex error: {e}")
                                    continue
                except Exception as e:
                    print(f"Error reading file {file_path}: {e}")
                    continue

    final_results = [{"plugin_name": k, "details": v} for k, v in results.items() if v]

    try:
        with open("results_temp.json", "w", encoding="utf-8") as f:
            json.dump(final_results, f, indent=4)
        print("DONE")
    except Exception as e:
        print(f"Error writing results file: {e}")