import openai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class PromptSubmission(BaseModel):
    prompt_text: str
    target_model: str
    competition_id: str
    user_id: str

class EvaluationResult(BaseModel):
    score: float
    feedback: str
    strengths: list
    weaknesses: list

@app.post("/evaluate", response_model=EvaluationResult)
async def evaluate_prompt(submission: PromptSubmission):
    try:
        # 获取竞赛要求
        competition = await get_competition(submission.competition_id)
        
        # 根据目标模型选择评估方法
        if submission.target_model == "gpt4":
            result = await evaluate_with_gpt4(submission.prompt_text, competition)
        elif submission.target_model == "claude":
            result = await evaluate_with_claude(submission.prompt_text, competition)
        else:
            result = await evaluate_generic(submission.prompt_text, competition)
            
        # 记录评估结果
        await save_evaluation(submission, result)
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def evaluate_with_gpt4(prompt, competition):
    # 使用GPT-4评估提示词质量
    # ...实现代码...
    return evaluation_result 