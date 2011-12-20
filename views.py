from os.path import join
from django.views.generic.edit import FormView
from django.conf import settings
from django.utils import simplejson as json

from progpac import forms
from progpac import h_language


class Home(FormView):
    template_name = "base.html"
    form_class = forms.Editor
    initial = {
        'text': "slssrssrssssrss",
    }

    def read_level(self, name):
        lines = []
        for line in open(join(settings.SITE_ROOT, 'levels', name)):
            line = line.rstrip()
            if line.startswith('.'):
                lines.append(list(line))
        return lines

    def get_context_data(self, *args, **kwargs):
        ctx = super(Home, self).get_context_data(*args, **kwargs)
        ctx['level'] = json.dumps(self.read_level('level1.txt'))
        return ctx

    def form_valid(self, form):
        parser = h_language.Parser(form.cleaned_data['text'])

        context = self.get_context_data()
        context.update({
            "form": form,
            "error": parser.error,
            "code": parser.code,
        })

        if self.request.POST['submit'] == 'Debug':
            context.update({
                "debug_code": parser.code,
                "debug_ast": parser.ast,
            })

        return self.render_to_response(context)
