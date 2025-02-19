# agent.py (updated with priority fixes and exception handling)
import os
import re
import time
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import generation_types
import absl.logging

# Suppress gRPC warnings
absl.logging.set_verbosity(absl.logging.ERROR)
os.environ['GRPC_DNS_RESOLVER'] = 'native'

load_dotenv()

class AIAgent:
    def __init__(self):
        self.model_name = "gemini-1.0-pro"
        self.client = self._initialize_client()

    def _initialize_client(self):
        """Initialize Gemini client with API key"""
        try:
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY not found in .env file")

            genai.configure(api_key=api_key)
            return genai.GenerativeModel(self.model_name)
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Gemini client: {str(e)}")

    def prioritize_tasks(self, tasks: List[Dict], simulate: bool = False, max_retries=3, initial_delay=1) -> List[Dict]:
        """Prioritize tasks with improved error handling"""
        if simulate:
            return self._simulate_prioritization(tasks)

        for attempt in range(max_retries + 1):
            try:
                prompt = self._build_prioritization_prompt(tasks)
                response = self.client.generate_content(prompt)
                return self._parse_prioritization(response.text, tasks)
            except Exception as e:  # General exception catch
                # Handle 429 errors using status_code attribute
                if hasattr(e, 'status_code') and e.status_code == 429:
                    if attempt < max_retries:
                        delay = initial_delay * (2 ** attempt)
                        print(f"Rate limited (attempt {attempt + 1}). Retrying in {delay}s...")
                        time.sleep(delay)
                    else:
                        print(f"Failed after {max_retries} retries. Using fallback.")
                        return self._fallback_prioritization(tasks)
                else:
                    print(f"Prioritization error: {str(e)}. Using fallback.")
                    return self._fallback_prioritization(tasks)

    def _parse_prioritization(self, response: str, original_tasks: List[Dict]) -> List[Dict]:
        """Enhanced parsing with exact description matching"""
        task_map = {t['description']: t for t in original_tasks}
        prioritized = []

        # Flexible regex pattern with debug logging
        pattern = r"Task:\s*(.+?)\s*[|∶•]\s*Priority:\s*(\d+)\s*[|∶•]\s*Reason:\s*(.+)"
        matches = re.finditer(pattern, response, re.IGNORECASE)

        for match in matches:
            try:
                full_desc = match.group(1).strip()
                priority = int(match.group(2))
                reason = match.group(3).strip()

                # Find original task by partial match
                original_task = next(
                    (t for t in original_tasks if t['description'] in full_desc),
                    None
                )

                if original_task:
                    prioritized.append({
                        "task": original_task,
                        "priority": priority,
                        "reason": reason
                    })
                else:
                    print(f"Description mismatch: '{full_desc}' not in original tasks")

            except (ValueError, IndexError, KeyError) as e:
                print(f"Error parsing line: {match.group(0)} - {str(e)}")

        if not prioritized:
            print("No valid priorities found. Response was:\n", response)
            return self._fallback_prioritization(original_tasks)

        return prioritized

    def _build_prioritization_prompt(self, tasks: List[Dict]) -> str:
        """Improved prompt with strict formatting instructions"""
        task_list = "\n".join([self._format_task(t) for t in tasks])
        return f"""Analyze and prioritize these tasks. Use STRICT format:

        Return EXACTLY 3 lines in this format:
        Task: [ORIGINAL DESCRIPTION] | Priority: [1-5] | Reason: [Brief Justification]

        Today: {datetime.now().strftime("%Y-%m-%d")}
        Tasks:
        {task_list}

        Do NOT modify task descriptions or add extra information."""

    def _format_task(self, task: Dict) -> str:
        """Standardize task formatting for prompts"""
        return f"- {task['description']} ({task.get('taskType', 'Task')}) Due: {task.get('deadline', 'No deadline')}"

    def _fallback_prioritization(self, tasks: List[Dict]) -> List[Dict]:
        """Deadline-based fallback sorting with priorities"""
        sorted_tasks = sorted(
            tasks,
            key=lambda x: x.get('deadline', '9999-12-31')
        )
        return [
            {
                "task": task,
                "priority": index + 1,
                "reason": "Fallback: Sorted by deadline"
            }
            for index, task in enumerate(sorted_tasks)
        ]

    def _fallback_reminder(self, task: Dict) -> str:
        """Simple fallback reminder"""
        return f"Reminder: Complete {task.get('description', 'your task')} by {task.get('deadline', 'the deadline')}"

    def _simulate_prioritization(self, tasks: List[Dict]) -> List[Dict]:
        """Mock prioritization for testing with priorities"""
        sorted_tasks = sorted(
            tasks,
            key=lambda x: x.get('deadline', '9999-12-31')
        )
        return [
            {
                "task": task,
                "priority": index + 1,
                "reason": "Simulated priority"
            }
            for index, task in enumerate(sorted_tasks)
        ]

    def _simulate_reminder(self, task: Dict) -> str:
        """Mock reminder for testing"""
        return f"Simulated reminder: {task.get('description', 'Complete task')} by {task.get('deadline', 'soon')}"