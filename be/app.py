from flask import request, Flask, jsonify
from flask_cors import CORS
from logic import plugins
from regex_logic import *
from datetime import datetime
from getcodec import *
import time

app = Flask(__name__)
CORS(app)

JSON_REGEX = 'json/list-regex.json'

# ==== Home ====
@app.route('/api/all-regex', methods=['GET'])
def get_all_regex():
    regex_data = load_regex_data()
    return jsonify({'list_regex': regex_data})

@app.route('/api/remove-regex/<int:regex_id>', methods=['DELETE'])
def remove_regex(regex_id):
    regex_list = load_regex_data() 
    new_regex_list = [regex for regex in regex_list if regex['id'] != regex_id]

    if len(new_regex_list) == len(regex_list):
        return jsonify({"message": "Regex not found"}), 404

    try:
        with open(JSON_REGEX, 'w') as file:
            json.dump({"list_regex": new_regex_list}, file, indent=4)
    except Exception as e:
        return jsonify({"message": f"Error saving file: {e}"}), 500

    return jsonify({"message": "Regex removed successfully"}), 200


@app.route('/api/execute', methods=['POST'])
def execute_regex():
    data = request.json
    search_regex = data.get('search_regex', '').strip()
    regex_id = data.get('regex_id')

    now = datetime.now()
    epoch_time = int(time.time()) 

    if search_regex:
        vuln_name = "Custom Regex"
        result_name = f"{now.strftime('%Y%m%d')}-{epoch_time}"
        pattern = search_regex
    elif regex_id:
        regex_list = load_regex_data()
        selected_regex = next((regex for regex in regex_list if regex['id'] == regex_id), None)

        if selected_regex:
            vuln_name = selected_regex['name']
            result_name = f"{now.strftime('%Y%m%d')}-{epoch_time}"
            pattern = selected_regex['pattern']
            pattern = get_patterns_id(regex_id)
        else:
            return jsonify({"error": "Regex ID not found"}), 404
    else:
        return jsonify({"error": "No search term or regex selected"}), 400

    read_files([pattern])

    results_temp_path = "results_temp.json"
    plugins_data = []

    if os.path.exists(results_temp_path):
        try:
            with open(results_temp_path, "r") as file:
                plugins_data = json.load(file)  # Ambil data dari results_temp.json
        except Exception as e:
            return jsonify({"error": f"Error reading results_temp.json: {e}"}), 500
        finally:
            os.remove(results_temp_path)  # Hapus file setelah diproses

    # Update result dengan plugins yang baru
    result = {
        "id": None,
        "name": result_name,
        "vuln_name": vuln_name,
        "re_pattern": pattern,
        "plugins": plugins_data 
    }

    try:
        with open("json/list-results.json", "r") as file:
            results_data = json.load(file)
    except FileNotFoundError:
        results_data = {"list_results": []}

    next_id = max([result['id'] for result in results_data["list_results"]], default=0) + 1

    result["id"] = next_id

    results_data["list_results"].append(result)

    try:
        with open("json/list-results.json", "w") as file:
            json.dump(results_data, file, indent=4)
    except Exception as e:
        return jsonify({"message": f"Error saving file: {e}"}), 500

    return jsonify({
        "message": "Execution finished",
        "result": result 
    })




# ==== Add Pattern ====
@app.route('/api/add-regex', methods=['POST'])
def add_regex():
    data = request.get_json()
    if not data or not all(key in data for key in ['name', 'pattern']):
        return jsonify({"message": "Invalid data. 'name', and 'pattern' are required."}), 400

    try:
        try:
            with open(JSON_REGEX, 'r') as file:
                regex_data = json.load(file)
                regex_list = regex_data.get('list_regex', [])
        except FileNotFoundError:
            regex_list = []
        except Exception as e:
            return jsonify({"message": f"Error loading file: {e}"}), 500

        new_id = max((regex['id'] for regex in regex_list), default=0) + 1

        new_regex = {
            "id": new_id,
            "name": data['name'],
            "pattern": data['pattern']
        }
        regex_list.append(new_regex)


        try:
            with open(JSON_REGEX, 'w') as file:
                json.dump({"list_regex": regex_list}, file, indent=4)
        except Exception as e:
            return jsonify({"message": f"Error saving file: {e}"}), 500

        return jsonify({"message": "Regex added successfully", "regex": new_regex}), 201

    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {e}"}), 500

# ==== Plugins ====
@app.route('/api/all-plugins', methods=['GET'])
def list_plugin_files():
    return jsonify({'plugins': plugins})


# ==== Results ====
@app.route('/api/all-results')
def get_all_results():
    results_data = load_results_data()
    return jsonify({'list_results': results_data})

@app.route('/api/result/<int:id>', methods=['GET'])
def get_result_by_id(id):
    result = next((item for item in load_results_data() if item["id"] == id), None)
    if result:
        return jsonify(result)
    return jsonify({"error": "Result not found"}), 404

@app.route('/api/remove-result/<int:result_id>', methods=['DELETE'])
def remove_result(result_id):
    try:
        with open('json/list-results.json', 'r') as file:
            data = json.load(file)
            results_list = data.get('list_results', [])
    except Exception as e:
        return jsonify({"message": f"Error loading file: {e}"}), 500

    new_results_list = [result for result in results_list if result['id'] != result_id]

    if len(new_results_list) == len(results_list):
        return jsonify({"message": "Result not found"}), 404

    try:
        with open('json/list-results.json', 'w') as file:
            json.dump({"list_results": new_results_list}, file, indent=4)
    except Exception as e:
        return jsonify({"message": f"Error saving file: {e}"}), 500

    return jsonify({"message": "Result removed successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)