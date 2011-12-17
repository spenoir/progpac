from lepl import *

class Func(List):
    @property
    def name(self):
        return self[0]

    @property
    def args(self):
        try:
            if isinstance(self[1], List):
                return self[1]
        except IndexError:
            pass

    @property
    def body(self):
        return filter(lambda x: isinstance(x,Body), self)[0]

class FuncCall(Func):
    pass

class FuncDef(Func):
    pass

class Variable(List):
    @property
    def name(self):
        return self[0]

class FuncDefArg(List): pass

class Moves(List): pass

class Main(List): pass

class Body(List): pass


# Drop 
comma = ~Token(',')
left_bracket = ~Token("\(")
right_bracket = ~Token("\)")
spaces = ~Token(r'[\\s\\t\\n]')[:]

# Predefinition
call = Delayed()
func = Delayed()

moves = (Token("[lsr]")[1:] > (lambda x: "".join(x)))
variable = Token('[A-Z]') > Variable
body = (moves | call | variable)[1:] > Body

func_name = Token("[abcdefghijkmnopqtuvwxyz]")

# Function Call
call_digits = Token('[A-Z]') & Token('\-') & Token("[0-9]")[1:] > (lambda x: "".join(x))
call_args = left_bracket & Or(moves, call_digits)[1:, comma] & right_bracket > List
call+= func_name & call_args[:1] > FuncCall

# Function definition
func_sep = ~Token(":")
func_args = left_bracket & Token('[A-Z]')[1:, comma] & right_bracket > List
func_loc = Token('[A-Z]')
func+= func_name & func_args[:1] & func_sep & body > FuncDef

line = LineStart() & spaces & Or(func, body)[:] & spaces & LineEnd()
lines = line[:] > Main
lines.config.lines()

ast = lines.parse(
"""

    x(C):Cx(ss)
    
    f(A,B):ABx(ll)
    
    f(rr,rr)sss
    
""")[0]

body = filter(lambda x: x.__class__ == Body, ast)[0]

funcs = dict(map(lambda x: (x[0], x),
                 filter(lambda x: isinstance(x,FuncDef), ast)))

STEPS = []

def go(body, loc=None):
    if loc is None:
        loc = {}
    
    for element in body:
        if isinstance(element, str):
            STEPS.append(element)
            
        elif isinstance(element, Variable):
            STEPS.append(loc[element.name])
            
        elif isinstance(element, FuncCall):
            function_call = element
            function_def = funcs[element.name]
            args = dict(zip(function_def.args, function_call.args))
            go(function_def.body, args)


if __name__ == "__main__":
    try:
        go(body)
    except RuntimeError:
        print "Maximum Recursion"
        STEPS.append("...")

    print "".join(STEPS)

