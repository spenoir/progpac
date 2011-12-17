from django.views.generic.edit import FormView


from . import forms

class Home(FormView):
    template_name = "base.html"
    form_class = forms.Editor
    initial = {
        'text': """x(C):Cx(ss)
f(A,B):ABx(ll)
f(rr,rr)sss
"""
    }

