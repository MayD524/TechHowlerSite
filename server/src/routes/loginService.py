import dbHandler
import uuid
_generalHandler = dbHandler.dbHandler("")

def isValidUser(uname:str, passw:str) -> bool:
    _generalHandler.move("users")
    whr = _generalHandler.where(("username", uname))
    _generalHandler.back()
    return True if whr else False

uname, passw = inputData.split("=")
if isValidUser(uname, passw):
    Result  = 200
    sessionID = uuid.UUID()
    OutData = "LOGIN_SUCESS;username=%s;session=%s" % (uname, sessionID)
    
    if cookies == None:
        cookies = {}

    cookies['user'] = uname
    cookies['sessionID'] = sessionID
    