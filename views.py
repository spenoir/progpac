from os.path import join
from django.views.generic.edit import FormView
from django.conf import settings
from django.utils import simplejson as json

from progpac import forms
from progpac import h_language
from progpac import models

class Home(FormView):
    template_name = "base.html"
    form_class = forms.Editor
    initial = { 'text': "sssrss" }

    def get_context_data(self, *args, **kwargs):
        context = super(Home, self).get_context_data(*args, **kwargs)
        level = models.Level.objects.get(name='level1').content
        context["level"] = [map(str, element) for element in level.split("\n")]
        return context

    def form_valid(self, form):
        level = models.Level.objects.get(name='level1')
        parser = h_language.Parser(form.cleaned_data['text'], level.content)

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
