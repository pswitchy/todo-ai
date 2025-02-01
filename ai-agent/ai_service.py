# ai_service.py (updated with enhanced error handling)
from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import AIAgent
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS
agent = AIAgent()

@app.route('/prioritize', methods=['POST'])
def prioritize():
    try:
        data = request.get_json()
        if not data or 'tasks' not in data:
            return jsonify({"error": "Invalid request format"}), 400
            
        tasks = data['tasks']
        if not isinstance(tasks, list):
            return jsonify({"error": "Tasks must be a list"}), 400

        prioritized = agent.prioritize_tasks(tasks)
        
        # Validate response format
        formatted_response = []
        for item in prioritized:
            if not all(key in item for key in ['task', 'priority', 'reason']):
                continue  # Skip invalid items
            formatted_response.append({
                **item["task"],
                "priority": item["priority"],
                "reason": item["reason"]
            })
        
        return jsonify(formatted_response)
        
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/reminder', methods=['POST'])
def reminder():
    try:
        data = request.get_json()
        if not data or 'task' not in data:
            return jsonify({"error": "Invalid request format"}), 400

        task = data['task']
        if not isinstance(task, dict):
            return jsonify({"error": "Task must be an object"}), 400

        response = agent.client.generate_content(
            f"Generate reminder for: {task.get('description')} due {task.get('deadline')}. Today is {datetime.now().strftime('%Y-%m-%d')}"
        )
        return jsonify({"reminder": response.text})
        
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)