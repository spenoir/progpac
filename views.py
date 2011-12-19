from django.views.generic.edit import FormView

from progpac import forms
from progpac import h_language


class Home(FormView):
    template_name = "base.html"
    form_class = forms.Editor
    initial = {
        'text': """x(C):Cx(ss)
f(A,B):ABx(ll)
f(rr,rr)sss
"""
    }

    def form_valid(self, form):
        parser = h_language.Parser(form.cleaned_data['text'])
        return self.render_to_response(
            self.get_context_data(
                form=form,
                code=parser.code,
                ast=parser.ast,
                error=parser.error
            ))
