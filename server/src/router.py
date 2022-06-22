from dataclasses import dataclass
import os
from dbHandler import *
from pprint import pprint

METHODS: list[str] = [
    "GET",
    "POST",
    "PUT",
    "DELETE"
]

AUTH_NONE = 0 # No authentication required
AUTH_LOW  = 1 # User must be logged in
AUTH_MED  = 2 # User must be logged in and be staff/Student Leader
AUTH_HIGH = 2 # User must be admin
AUTH_DEV  = 3 # User must be developer

@dataclass
class route:
    methods:list[str]   ## list of allowed methods
    path:str            ## path to the endpoint
    requiresLogin:bool  ## if the user needs to be logged in
    handler:str         ## custom handler (can be none)
    authLevel:int       ## authentication level
    
    def __str__(self) -> str:
        return f"Routes:\nMethods : {self.methods}\nPath : {self.path}\nLogin : {self.requiresLogin}\nHandler : {self.handler}\nAuth Level : {self.authLevel}"

    def invoke(self, cookies:dict, path:str, method:str, data:str=None) -> dict:
        """
            All routes which are invoked MUST
            have three variables. These should be found in
            the local scope.
            
            1. Result  (int) a number determining what the HTTP status
            code for this route should be
            
            2. OutData (str|bytes) the HTML that should be sent back to whomever
            made the request
        
            3. Cookies (dict) the cookies that are either changed or kept the same;
            can be set to None and it wont cause any issues.
        
        """
        
        code = self.handler
        if self.handler.endswith(".py"):
            assert os.path.exists(self.handler), "Handler does not exists %s for %s" % (self.handler, self.path)
            with open(self.handler, 'r') as reader:
                code = reader.read()
        loc = {
            'inputData' : data,
            'cookies'   : cookies,
            'method'    : method,
            'methods'   : self.methods,
            'loginReq'  : self.requiresLogin,
            'authLevel' : self.authLevel,
            'path'      : self.path,
            'GEN_TYPES' : ['text/html', 'text/javascript', 'text/css'],
            'givenPath' : path,
            'OutData'   : '',
            'Result'    : 500
        }
        exec(code, globals(), loc)
        
        return loc

class router:
    __slots__ = ["routes", "__dbhandler"]
    
    def __init__(self, _handler:dbHandler) -> None:
        self.routes = []
        self.__dbhandler = _handler
        
        self.__dbhandler.newTable("routes", {
            "ID"        : "INCREMENTED",  # Item ID
            "path"      : "str",          # Path to route
            "methods"   : "str",          # What HTTP methods are allowed
            "callback"  : "str",          # python file to call 
            "AUTH_LEVEL": "int",          # auth level of this route.
            "author"    : 'str',          # who has created this route
            "loginReq"  : 'int'           # 0 or 1 based on if login is required
        })
        self.__dbhandler.move('routes')
        
        self.__setup()
        self.__dbhandler.back()
        
    def __setup(self) -> None:
        dbRoutes = self.__dbhandler.getTable()
        for liRoute in dbRoutes['data']:
            newRoute  = route(liRoute['methods'].split(","), liRoute['path'], True if liRoute['loginReq'] == '1' else False, liRoute['callback'], int(liRoute['AUTH_LEVEL']))
            self.routes.append(newRoute)
        
    def isValidMethod(self, method:str) -> bool:
        return method in METHODS if isinstance(method, str) else any(x for x in method if x in METHODS)
    
    def isValidRoute(self, method:str, path:str) -> bool:
        return self.isValidMethod(method) and self.route(method, path) != None
    
    def __methodCheck(self, r:route, method:str|list) -> bool:
        if isinstance(method, list) and not any(x for x in method if x in r.methods):
            return False
        elif isinstance(method, str) and not method in r.methods:
            return False
        return True
    
    def route(self, method:str|list, path:str) -> route:
        for r in self.routes:
            
            if '*' in r.path:
                ## check if the structure of the path before the * is the same
                tmp = r.path.replace("*",'')
                if tmp in path and self.__methodCheck(r, method):
                    return r
            
            elif r.path == path and self.__methodCheck(r, method):
                return r
        return None
    
    def newRoute(self, methods:list[str], path:str, author:str, handler:str=None, authLevel:int=AUTH_NONE, requiresLogin:bool=False) -> None:
        if not self.isValidRoute(methods, path):
            self.routes.append(route(methods, path, True if requiresLogin or authLevel != 0 else False , handler, authLevel))
            
            self.__dbhandler.insertAt({
                "path"       : path,
                "methods"    : ','.join(methods),
                "callback"   : handler,
                "AUTH_LEVEL" : str(authLevel),
                "author"     : author,
                "loginReq"  : "1" if requiresLogin else "0"
            }, "routes")
            