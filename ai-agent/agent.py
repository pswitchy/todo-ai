# ai-agent/agent.py
import os
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import GPT4All

# Load environment variables
load_dotenv()

class AIAgent:
    def __init__(self):
        self.model_path = os.getenv('GPT4ALL_MODEL_PATH', './models/ggml-gpt4all-j-v1.3-groovy.bin')
        self.llm = self._initialize_model()
        
    def _initialize_model(self):
        """Initialize the GPT4All language model"""
        try:
            return GPT4All(model=self.model_path, verbose=False)
        except Exception as e:
            raise RuntimeError(f"Failed to initialize AI model: {str(e)}")

    def prioritize_tasks(self, tasks: List[Dict], simulate: bool = False) -> List[Dict]:
        """
        Prioritize tasks using AI analysis of description, deadline, and type
        
        Args:
            tasks: List of task dictionaries
            simulate: Whether to use simulated AI or real model
            
        Returns:
            List of prioritized tasks with AI reasoning
        """
        if simulate:
            return self._simulate_prioritization(tasks)
            
        prompt_template = PromptTemplate(
            input_variables=["tasks"],
            template="""Analyze these tasks and prioritize them. Consider deadlines, task types, and descriptions.
            Return the prioritized order with brief reasoning. Use ISO dates for deadline comparison.

            Tasks:
            {tasks}

            Format response as:
            - Task: [task description] | Priority: [1-5] | Reason: [short reason]
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        task_list = "\n".join([self._format_task(t) for t in tasks])
        
        try:
            response = chain.invoke({"tasks": task_list})
            return self._parse_prioritization(response['text'], tasks)
        except Exception as e:
            print(f"AI prioritization failed: {str(e)}")
            return self._fallback_prioritization(tasks)

    def generate_reminder(self, task: Dict, simulate: bool = False) -> str:
        """
        Generate a context-aware reminder using AI
        
        Args:
            task: Task dictionary
            simulate: Whether to use simulated AI or real model
            
        Returns:
            Generated reminder text
        """
        if simulate:
            return self._simulate_reminder(task)
            
        prompt_template = PromptTemplate(
            input_variables=["task"],
            template="""Generate a helpful reminder for this task. Consider:
            - Task type: {task_type}
            - Deadline: {deadline}
            - Description: {description}
            
            Make it friendly and motivational. Include time sensitivity.
            """
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt_template)
        
        try:
            response = chain.invoke({
                "task_type": task.get('taskType', 'task'),
                "deadline": task.get('deadline', 'unknown'),
                "description": task.get('description', '')
            })
            return response['text'].strip()
        except Exception as e:
            print(f"Reminder generation failed: {str(e)}")
            return self._fallback_reminder(task)

    def _format_task(self, task: Dict) -> str:
        """Format task for AI prompt"""
        deadline = task.get('deadline', 'No deadline')
        return f"- {task['description']} ({task.get('taskType', 'Task')}) Due: {deadline}"

    def _parse_prioritization(self, response: str, original_tasks: List[Dict]) -> List[Dict]:
        """Parse AI response into structured format"""
        prioritized = []
        task_map = {t['description']: t for t in original_tasks}
        
        for line in response.split('\n'):
            if '- Task:' in line:
                parts = line.split('|')
                if len(parts) >= 3:
                    desc = parts[0].split(':')[1].strip()
                    priority = parts[1].split(':')[1].strip()
                    reason = parts[2].split(':')[1].strip()
                    
                    if desc in task_map:
                        prioritized.append({
                            "task": task_map[desc],
                            "priority": int(priority),
                            "reason": reason
                        })
        return prioritized or self._fallback_prioritization(original_tasks)

    def _fallback_prioritization(self, tasks: List[Dict]) -> List[Dict]:
        """Fallback sorting by deadline"""
        return sorted(
            [{"task": t, "reason": "Sorted by deadline (fallback)"} for t in tasks],
            key=lambda x: x['task'].get('deadline', '9999-12-31')
        )

    def _fallback_reminder(self, task: Dict) -> str:
        """Fallback reminder generator"""
        return f"Reminder: Don't forget to {task.get('description', 'complete your task')} by {task.get('deadline', 'the deadline')}"

    def _simulate_prioritization(self, tasks: List[Dict]) -> List[Dict]:
        """Simulated AI prioritization"""
        return sorted(
            [{"task": t, "reason": "Simulated priority sorting"} for t in tasks],
            key=lambda x: x['task'].get('deadline', '9999-12-31')
        )

    def _simulate_reminder(self, task: Dict) -> str:
        """Simulated reminder generation"""
        return f"Simulated reminder: Complete {task.get('description', 'task')} by {task.get('deadline', 'soon')}"

if __name__ == "__main__":
    try:
        agent = AIAgent()
        
        sample_tasks = [
            {"description": "Write report", "deadline": "2024-12-20", "taskType": "Work"},
            {"description": "Buy groceries", "deadline": "2024-12-10", "taskType": "Personal"},
            {"description": "Prepare presentation", "deadline": "2024-12-15", "taskType": "Work"}
        ]

        print("Real AI Prioritization:")
        prioritized = agent.prioritize_tasks(sample_tasks)
        for task in prioritized:
            print(f"{task['task']['description']} - {task['reason']}")

        print("\nSimulated Prioritization:")
        simulated = agent.prioritize_tasks(sample_tasks, simulate=True)
        for task in simulated:
            print(f"{task['task']['description']} - {task['reason']}")

        sample_task = sample_tasks[0]
        print("\nReal AI Reminder:")
        print(agent.generate_reminder(sample_task))
        
        print("\nSimulated Reminder:")
        print(agent.generate_reminder(sample_task, simulate=True))

    except Exception as e:
        print(f"Error initializing AI agent: {str(e)}")
        print("Please ensure the model file exists at the specified path")