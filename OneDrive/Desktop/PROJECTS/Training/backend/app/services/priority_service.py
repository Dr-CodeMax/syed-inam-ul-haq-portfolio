def calculate_priority(symptoms: str):
    if not symptoms:
        return "NORMAL", 10

    s = symptoms.lower()

    if "chest pain" in s or "breathing" in s:
        return "EMERGENCY", 100

    if "fever" in s or "infection" in s:
        return "HIGH", 70

    if "pain" in s:
        return "MEDIUM", 40

    return "LOW", 10