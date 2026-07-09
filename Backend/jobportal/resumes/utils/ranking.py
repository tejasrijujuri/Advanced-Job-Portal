def calculate_score(job_skills, resume_skills, experience_years=0):

    job_set = set(job_skills)
    resume_set = set(resume_skills)

    # skill match
    matched = job_set.intersection(resume_set)
    skill_score = (len(matched) / len(job_set)) * 70

    # experience weight
    exp_score = min(experience_years * 10, 30)

    return round(skill_score + exp_score, 2)