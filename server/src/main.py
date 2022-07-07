from http.server import SimpleHTTPRequestHandler, HTTPServer
from http.cookies import CookieError, SimpleCookie
from socketserver import ThreadingMixIn
from _thread import start_new_thread
from dbHandler import dbHandler
from datetime import datetime
from urllib import parse
from router import *

import logging
import pprint
import time
import json
import ssl
import os


## Threaded HTTP server
class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    pass

class httpServer(SimpleHTTPRequestHandler):
    def set_headers(self, code:int=200, dType:str="text/html", cookies:SimpleCookie=None) -> None:
        self.send_response(code)
        self.send_header("Content-type", dType)
        #if cookies:
        #    for name, value in cookies.items():
        #        self.send_header("Set-Cookie", name + "=" + value)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, content-type")
        self.end_headers()
        
    def cookieJarHandler(self) -> dict[str, str]:
        try:
            cookies    = SimpleCookie(self.headers.get('Cookie'))
            outCookies = {}
            
            for cookie in cookies.values():
                cookie = cookie.OutputString().split("=")
                outCookies[cookie[0]] = cookie[1]
            return outCookies
        except CookieError as e:
            logging.error("CookieJarHandler Error: " + str(e))
            return {}
        
    def do_OPTIONS(self) -> None:
        self.set_headers(200)

    def send(self, data:str) -> None:
        self.wfile.write(bytes(data, 'utf-8'))

    def read(self) -> str:
        data = self.rfile.read(int(self.headers.get("Content-Length"))).decode('utf-8')
        return parse.unquote_plus(data)

    def ERROR(self, error:str="Unknown Error") -> None:
        self.set_headers(500)
        self.wfile.write(bytes(error, 'utf-8'))

    def do_GET(self) -> None:
        cookies = self.cookieJarHandler()
        
        path = parse.unquote_plus(self.path)
        print(path)
        route = _router.route("GET", path)
        if not route:
            self.ERROR("<h1>404</h1><p>Route %s does not exists or was not found.</p>" % path)
            return
        
        ret = route.invoke(cookies, path, "GET", path)
        
        dType = ret['dType'] if 'dType' in ret else 'text/html'
        
        self.set_headers(ret['Result'], dType, ret['cookies'])
        if isinstance(ret['OutData'], bytes):
            self.wfile.write(ret['OutData'])
            return
        
        self.send(ret['OutData'])
        
    def do_POST(self) -> None:
        cookies = self.cookieJarHandler()
        path = parse.unquote_plus(self.path)
        data = json.loads(self.read())

        ## now to route
        route = _router.route("POST", path)
        pprint.pprint(data)
        if not route:
            self.ERROR("<h1>404</h1><p>Route %s does not exist or was/is not accessible to your current user.")
            return
        
        ret = route.invoke(cookies, path, "POST", data)
        MimeType = ret['dType'] if 'dType' in ret else 'text/html'
        
        self.set_headers(ret['Result'], MimeType, ret['cookies'])
        if isinstance(ret['OutData'], bytes):
            self.wfile.write(ret['OutData'])
            return
        
        self.send(ret['OutData'])

def autoWriteService(_handler:dbHandler, timer:int=60) -> None:
    while True:
        time.sleep(timer)
        _handler._write()

def loggingSetup(   level:int=logging.INFO, 
                    format:str="%(asctime)s - %(levelname)s - %(message)s",
                    outFile:str="") -> None:
    if outFile != '':
        logging.basicConfig(level=level, format=format, filename=outFile)
    else:
        logging.basicConfig(level=level, format=format)

def setRoutes() -> None:
    _router.newRoute(["GET", "POST", "PUT"] , "/"             , "May", "routes/index.py"   , AUTH_NONE, False)
    _router.newRoute(["GET"]                , "/sw.js"        , "May", "routes/sw.py"       , AUTH_NONE, False)
    _router.newRoute(["GET", "POST", "PUT"] , "/html"         , "May", "routes/index.py"   , AUTH_NONE, False)
    _router.newRoute(["GET"]                , "/favicon.ico"  , "May", 'routes/favicon.py'                   )
    _router.newRoute(['GET']                , '/dist/*'       , "May", 'routes/getJS.py'                     )
    _router.newRoute(['GET']                , '/style/*'      , "May", 'routes/genCss.py'                    )
    _router.newRoute(["POST"]               , "/api/login"    , "May", 'routes/loginService.py'              )
    _router.newRoute(["GET"]                , "/resources/*"  , "May", 'routes/resourceHandler.py'           )
    _router.newRoute(["POST"]               , "/api/register" , "May", 'routes/registerService.py'           )
    _router.newRoute(["GET"]                , "/api/test"     , "May", 'routes/test.py'                      )
    _router.newRoute(["POST"]               , "/api/makePost" , "May", 'routes/makePost.py' , AUTH_LOW, True )
    _router.newRoute(["POST", "GET"]        , "/api/users/*"  , "May", 'routes/user.py'     , AUTH_LOW, True )
    _generalHandler.move("")
    _generalHandler.newTable("users", {
        "ID"       : "INCREMENTED",
        "username" : "str",
        "password" : "str",
        "studentID": "int",
        "firstName": "str",
        "lastName" : "str",
        "grade"    : "int",
        "authLevel": "int",
        "email"    : "str",
        "about"    : "str",
        "pfp"      : "str",
        "status"   : "str",
        "warns"    : "int",
        "accCreate": "str"
        })

    _generalHandler.newTable("post", {
        "ID"        : "INCREMENTED", ## id of the post
        "author"    : "str",         ## author of the post
        "postDate"  : "int",         ## when was the post made
        "message"   : "str",         ## the post data (what the message says)
        "likes"     : "int",         ## how popular is this post?
        "parent"    : "int",         ## is this a comment? if so this should be >-1 or null
        "form"      : "str",         ## what form does this post belong to
    })
    
    _generalHandler.newTable('events', {
        "ID"            : "INCREMENTED",
        "author"        : "str",
        "eventStart"    : "int",
        "eventEnd"      : "int",
        "eventName"     : "str",
        "eventCapacity" : "int",
        "eventLocation" : "str"
    })
    
    _generalHandler.newTable('clubs', {
        "ID"             : "INCREMENTED",
        "infinityStatus" : "int",
        "leader"         : "str",
        "advisor"        : "str",
        "clubName"       : "str",
        "members"        : "str",
        "meetingDate"    : "str",
        "meetingTime"    : "int",
        "roomNum"        : "int"
    })

    _generalHandler.back()
    _generalHandler._write()
    
def runServer(host:str="localhost", port:int=8080, _handler:dbHandler=None, _router:router=None):
    print("Prepairing Loggin...")
    loggingSetup()
    print("Done!\nSetting routes...")
    setRoutes()
    print("Done!\nServer starting...")
    
    serverAddress = (host, port)
    httpd = ThreadingHTTPServer(serverAddress, httpServer)
    #httpd.socket = ssl.wrap_socket(httpd.socket,
    #                                server_side=True,
    #                                certfile='data/techhowler.pem',
    #                                keyfile="data/selfsigned.key",
    #                                ssl_version=ssl.PROTOCOL_TLS)
    start_new_thread(autoWriteService, (_handler, ))
    
    try:
        print(f"Starting server on {host}:{port} | localhost:{port}")
        logging.log(logging.INFO, f"Starting server on {host}:{port}")
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    
    logging.log(logging.INFO, f"Stopping server")
    print('\nShutting down server...')
    httpd.server_close()
    _handler._write()

assert __name__ == "__main__", "ImportError -> This file is not supposed to be imported!"

_firstBoot:bool = True

_generalHandler = dbHandler("./database/server.db")
_router         = router(_generalHandler)

runServer("0.0.0.0", 8080, _generalHandler, _router)

_generalHandler._write()