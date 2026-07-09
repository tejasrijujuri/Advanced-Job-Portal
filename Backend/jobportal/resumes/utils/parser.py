def extract_skills(text):
    SKILLS = ["python", "django", "react", "sql", "aws", "docker"]

    found = []

    for skill in SKILLS:
        if skill in text:
            found.append(skill)

    return found