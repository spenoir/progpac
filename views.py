from os.path import join
from django.views.generic.edit import FormView
from django.conf import settings
from django.utils import simplejson as json

from progpac import forms
from progpac import h_language


class Home(FormView):
    template_name = "base.html"
    form_class = forms.Editor
    initial = { 'text': "sssrss" }

    def get_context_data(self, *args, **kwargs):
        context = super(Home, self).get_context_data(*args, **kwargs)
        level_lines = open(join(
            settings.SITE_ROOT, 'levels', 'level1.txt')).readlines()[:25]
        context["level"] = json.dumps(
            [map(str, line.rstrip()) for line in level_lines])
        return context

    def form_valid(self, form):
        level = open(join(settings.SITE_ROOT, 'levels', 'level1.txt')).read()
        parser = h_language.Parser(form.cleaned_data['text'], level)

        context = {
            "form": form,
            "error": parser.error,
            "code": parser.code,
        }

        if self.request.POST['submit'] == 'Debug':
            context.update({
                "debug_code": parser.code,
                "debug_ast": parser.ast,
            })

        return self.render_to_response(
            self.get_context_data(**context))
