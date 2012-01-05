from django import forms
from progpac import models


class Editor(forms.Form):
    text = forms.CharField(
        widget=forms.Textarea(
            attrs={
                'class':'span6',
                'rows':'6'
            }
        ))


class ResultForm(forms.ModelForm):
    class Meta:
        model = models.Result
        fields = ("program", "level", "username", "email")
        widgets = {
            "name": forms.TextInput(),
            "program": forms.HiddenInput(),
            "level": forms.HiddenInput()
        }