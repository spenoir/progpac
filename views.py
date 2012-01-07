from django.views.generic import (FormView, RedirectView, TemplateView,
                                  CreateView, View)
from django.views.generic.edit import BaseCreateView
from django.conf import settings
from django.utils import simplejson as json
from django.core.urlresolvers import reverse
from django.db.models import Min
from django.http import HttpResponseRedirect

from progpac import forms
from progpac import h_language
from progpac import models


class Home(RedirectView):
    permanent = False
    
    def get_redirect_url(self, **kwargs):
        last_level_hash = self.request.session.get('last_level_hash', None)
        if last_level_hash:
            level = models.Level.objects.get(hash=last_level_hash)
        else:
            level = models.Level.objects.all()[:1].get()
            self.request.session['last_level_hash'] = level.hash
        
        return level.get_absolute_url()


class Level(FormView):
    template_name = "level.html"
    form_class = forms.Editor

    def get_initial(self):
        return {"text": self.request.session.get(self.level.hash, "")}
    
    @property
    def level(self):
        return models.Level.objects.get(hash=self.kwargs.get('level_hash'))
    
    def get_context_data(self, *args, **kwargs):
        context = super(Level, self).get_context_data(*args, **kwargs)
        context["level_json"] = json.dumps(self.level.lines)
        context["level"] = self.level
        return context

    def form_valid(self, form):
        self.request.session[self.level.hash] = form.cleaned_data['text']
        
        parser = h_language.Parser(
            form.cleaned_data['text'],
            self.level
        )

        code = "".join(parser.code)
        
        context = {
            "form": form,
            "error": parser.error,
            "code": code
        }

        if code.find("@") > -1 and parser.program_length <= self.level.maxsize:
            context['level_next'] = self.level.next
            initial=dict(
                level=self.level,
                program=parser.program,
                email=self.request.session.get("email", "someone@somewhere.com"),
                username=self.request.session.get("username", "someone")
            )
            context['result_form'] = forms.ResultForm(initial=initial)
            self.request.session['last_level_hash'] = self.level.next.hash

        if self.request.POST['submit'] == 'Debug':
            context.update({
                "debug_code1": code,
                "debug_code2": parser.code_debug,
                "debug_ast": parser.ast,
            })

        return self.render_to_response(
            self.get_context_data(**context))


class ResultSave(View):

    def post(self, request):
        form = forms.ResultForm(request.POST)
        
        if form.is_valid():

            self.request.session["email"] = form.cleaned_data['email']
            self.request.session["username"] = form.cleaned_data['username']
            
            level = form.cleaned_data['level']
            
            parser = h_language.Parser(
                form.cleaned_data['program'],
                level
            )
            
            code = "".join(parser.code)

            if code.find("@") > -1 and parser.program_length <= level.maxsize:
                result = form.save(commit=False)
                result.program_length = parser.program_length
                result.save()
                return HttpResponseRedirect(level.next.get_absolute_url())

        return HttpResponseRedirect(level.get_absolute_url())


class Help(TemplateView):
    template_name = "help.html"


class Results(TemplateView):
    template_name = "results.html"
    
    def get_context_data(self, *args, **kwargs):
        return {
            "levels": models.Level.objects.all()
        }