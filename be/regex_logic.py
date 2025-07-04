import json

def load_regex_data():
    try:
        with open('json/list-regex.json', 'r') as file:
            data = json.load(file)
            return data.get('list_regex', [])
    except Exception as e:
        print(f"Error loading regex data: {e}")
        return []
    

def load_results_data():
    try:
        with open('json/list-results.json', 'r') as file:
            data = json.load(file)
            return data.get('list_results', [])
    except Exception as e:
        print(f"Error loading regex data: {e}")
        return []