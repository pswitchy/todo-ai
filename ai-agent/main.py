# main.py
from agent import AIAgent

def main():
    try:
        agent = AIAgent()

        test_tasks = [
            {"description": "Prepare project demo", "deadline": "2024-12-21", "taskType": "Work"},
            {"description": "Book dentist appointment", "deadline": "2024-12-09", "taskType": "Personal"},
            {"description": "Update documentation", "deadline": "2024-12-20", "taskType": "Work"},
            {"description": "Meeting", "deadline": "2024-12-09", "taskType": "Work"}
        ]

        print("=== AI Task Prioritization ===")
        prioritized = agent.prioritize_tasks(test_tasks)
        for item in prioritized:
            print(f"Priority {item.get('priority', 'N/A')}: {item['task']['description']}")
            print(f"Reason: {item.get('reason', 'No reason provided')}\n")

    except Exception as e:
        print(f"Error initializing AI agent: {str(e)}")

if __name__ == "__main__":
    main()