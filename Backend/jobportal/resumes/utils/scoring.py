def calculate_score(job_skills, resume_skills):
    job_set = set([s.strip().lower() for s in job_skills])
    resume_set = set([s.strip().lower() for s in resume_skills])

    matched = job_set.intersection(resume_set)

    if not job_set:
        return 0

    score = (len(matched) / len(job_set)) * 100
    return round(score, 2)