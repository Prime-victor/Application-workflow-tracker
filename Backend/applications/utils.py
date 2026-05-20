from django.db.models import Max
from django.utils import timezone


def generate_tracking_number(model_class) -> str:
    year = timezone.now().year
    prefix = f"APP-{year}-"
    max_tracking_number = (
        model_class.objects.filter(tracking_number__startswith=prefix)
        .aggregate(Max("tracking_number"))
        .get("tracking_number__max")
    )

    if not max_tracking_number:
        next_sequence = 1
    else:
        next_sequence = int(max_tracking_number.split("-")[-1]) + 1

    return f"{prefix}{next_sequence:04d}"
