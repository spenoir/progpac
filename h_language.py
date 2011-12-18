from lepl import *

class Func(List):
    @property
    def name(self):
        return self[0]

    @property
    def args(self):
        try:
            if isinstance(self[1], FuncArgs):
                return self[1]
        except IndexError:
            pass
        return []

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

class FuncArgs(List): pass

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
call_args = left_bracket & Or(moves, call_digits)[1:, comma] & right_bracket > FuncArgs
call+= func_name & call_args[:1] > FuncCall

# Function definition
func_sep = ~Token(":")
func_args = left_bracket & Token('[A-Z]')[1:, comma] & right_bracket > FuncArgs
func_loc = Token('[A-Z]')
func+= func_name & func_args[:1] & func_sep & body > FuncDef

line = LineStart() & Or(func, body)[:] & LineEnd()
parser = line[:] > Main
parser.config.lines()


class Parser(object):

    def __init__(self, code):
        try:
            self.ast = parser.parse(code)[0]
            self.body = filter(lambda x: x.__class__ == Body, self.ast)[0]
            self.funcs = dict(
                map(lambda x: (x[0], x),
                filter(lambda x: isinstance(x,FuncDef), self.ast)))
            
            self.code = self.go(self.body)
            self.error = None
        except FullFirstMatchException as e:
            self.error = e.message
        except Error as e:
            self.error = e.msg
            self.body = None
            self.ast = None
            self.funcs = {}
            self.code = ""
            

    def go(self, body, loc=None, steps=None):
        if loc is None:
            loc = {}
        if steps is None:
            steps = []

        for element in body:
            if isinstance(element, basestring):
                steps.append(element)
            
            elif isinstance(element, Variable):
                steps.append(loc[element.name])
            
            elif isinstance(element, FuncCall):
                function_call = element

                try:
                    function_def = self.funcs[element.name]
                except KeyError:
                    raise Error("Function %s not defined." % element.name, {})

                if len(function_def.args) != len(element.args):
                    raise Error("Wrong arguments in function %s call."
                                % element.name, {})
                args = dict(zip(function_def.args, function_call.args))
                try:
                    steps.append( self.go(function_def.body, args) )
                except RuntimeError:
                    steps.append("...")
    
        return "".join(steps)


if __name__ == "__main__":
    code =  """s"""
    parser = Parser(code)
    print parser.code
