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
        tasks = data.get('tasks', [])
        prioritized = agent.prioritize_tasks(tasks)
        return jsonify([{
            **item["task"],
            "priority": item["priority"],
            "reason": item["reason"]
        } for item in prioritized])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/reminder', methods=['POST'])
def reminder():
    try:
        data = request.get_json()
        task = data.get('task', {})
        response = agent.client.generate_content(
            f"Generate reminder for: {task.get('description')} due {task.get('deadline')}. Today is {datetime.now().strftime('%Y-%m-%d')}"
        )
        return jsonify({"reminder": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)