from lepl import *
from lepl.matchers.error import syntax_error_kargs
    

def init(self, stream):
    self.lineno = s_deepest(stream)[1]._delta[1]
    self.offset = s_deepest(stream)[1]._delta[0]
    self.msg = "The match failed"

FullFirstMatchException.__init__ = init


def with_line(node):
    def wrapper(results, stream_out, **kwargs): 
        location_helper = syntax_error_kargs(
            kwargs['stream_in'], stream_out, results)
        return node(results,
                    in_lineno=location_helper['in_lineno'],
                    in_char=location_helper['in_char'])
    return wrapper 


class List(List):
    def __init__(self, *args, **kwargs):
        self.in_lineno = kwargs.pop('in_lineno', 0)
        self.in_char = kwargs.pop('in_char', 0)
        super(List, self).__init__(*args, **kwargs)


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

# Predefinition
call = Delayed()
func = Delayed()

moves = (Token("[lsr]")[1:] > (lambda x: "".join(x)))
variable = Token('[A-Z]') ** with_line(Variable)
body = (moves | call | variable)[1:] ** with_line(Body)

func_name = Token("[abcdefghijkmnopqtuvwxyz]")

# Function Call
call_digits = Token('[A-Z]') & Token('\-') & Token("[0-9]")[1:] > (lambda x: "".join(x))
call_args = left_bracket & Or(moves, call_digits)[1:, comma] & right_bracket > FuncArgs
call+= (func_name & call_args[:1]) ** with_line(FuncCall)

# Function definition
func_sep = ~Token(":")
func_args = left_bracket & Token('[A-Z]')[1:, comma] & right_bracket > FuncArgs
func_loc = Token('[A-Z]')
func+= (func_name & func_args[:1] & func_sep & body) ** with_line(FuncDef)

line = LineStart() & Or(func, body)[:] & LineEnd()
parser = (line[:] > Main)
parser.config.lines()


class Parser(object):

    def __init__(self, code, level=""):

        if level:
            self.setup_level(level)
            
        self.body = None
        self.ast = None
        self.funcs = {}
        self.code = ""
        self.error = None
        
        try:
            self.ast = parser.parse(code)[0]
            self.body = filter(lambda x: x.__class__ == Body, self.ast)[0]
            self.funcs = dict(
                map(lambda x: (x[0], x),
                filter(lambda x: isinstance(x,FuncDef), self.ast)))
            
            self.code = self.go(self.body)
        except (Error, FullFirstMatchException) as e:
            self.error = "Line: %s, Character: %s. %s" % (
                e.lineno, e.offset, e.msg)

    def setup_level(self, level):
        self.level_lines = level.split("\n")
        for i, line in enumerate(self.level_lines):
            index = line.find("u")
            if index > 0:
                position = (i, index)

        self.position = position
        self.direction = 0

    def go(self, body, loc=None, steps=None):
        if loc is None:
            loc = {}
        if steps is None:
            steps = []

        for element in body:
            if isinstance(element, basestring):
                for move in element:

                    if move == "s":
                        real_position = self.direction % 4
                        
                        if real_position == 0:
                            next_place = self.level_lines[self.position[0]-1][self.position[1]]
                            next_position = (self.position[0]-1, self.position[1])
                        elif real_position == 1:
                            next_place = self.level_lines[self.position[0]][self.position[1]+1]
                            next_position = (self.position[0], self.position[1]+1)
                        elif real_position == 2:
                            next_place = self.level_lines[self.position[0]+1][self.position[1]]
                            next_position = (self.position[0]+1, self.position[1])
                        elif real_position == 3:
                            next_place = self.level_lines[self.position[0]][self.position[1]-1]
                            next_position = (self.position[0], self.position[1]-1)
                        
                        if next_place in (".", "o"):
                            steps.append(move)
                            self.position = next_position
                        else:
                            steps.append("x")
                        
                    if move in "r":
                        steps.append(move)
                        self.direction=+1
                    if move in "l":
                        steps.append(move)
                        self.direction=-1
            
            elif isinstance(element, Variable):
                steps.append(loc[element.name])
            
            elif isinstance(element, FuncCall):
                function_call = element

                try:
                    function_def = self.funcs[element.name]
                except KeyError:
                    raise Error("Function %s not defined." % element.name,
                                {"in_lineno": element.in_lineno,
                                 "in_offset": element.in_char})

                if len(function_def.args) != len(element.args):
                    raise Error("Wrong arguments in function %s call." % element.name,
                                {"in_lineno": element.in_lineno,
                                 "in_offset": element.in_char})
                args = dict(zip(function_def.args, function_call.args))
                try:
                    steps.append( self.go(function_def.body, args) )
                except RuntimeError:
                    steps.append("...")
    
        return "".join(steps)


if __name__ == "__main__":
    code =  """ssrls
    """
    parser = Parser(code, open('levels/level1.txt').read())
    print parser.code
    print parser.error
