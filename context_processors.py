def default(request):
    from progpac.models import Level
    return {
        'all_levels': Level.objects.all()
    }
