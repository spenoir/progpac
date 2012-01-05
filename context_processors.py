def default(request):
    from progpac.models import Level

    last_level_hash = request.session.get('last_level_hash')
    last_level = Level.objects.get(hash=last_level_hash)

    return {
        'previous_levels': last_level.all_previous()
    }
