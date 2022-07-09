
def isValidUser(uname:str, passw:str, key:str, dbhandler) -> bool:
    dbhandler.move("users")
    whr = dbhandler.where(("username", uname))
    dbhandler.back()
    if not whr:
        return False
    #return decryptPassword(passw, key) == whr['password']
    return passw == whr['password']

if cookies == None:
    cookies = {}

Result = 500
OutData = "LOGIN_FAILURE"

uname = inputData['name']
if "password" in inputData:
    passw = inputData['password']
    if isValidUser(uname, passw, inputData['sessionID'], dbhandler):
        Result  = 200
        OutData = "LOGIN_SUCCESS;username=%s;session=%s" % (uname, inputData['sessionID'])

        sessionKeys[inputData['name']] = inputData['sessionID']
    
else:
    key   = inputData['sessionID']
    if uname in sessionKeys and key == sessionKeys[uname]:
        Result = 200
        OutData = "LOGIN_SUCCESS;username=%s;session=%s" %(uname, key)
    else:
        OutData = "LOGIN_FAIL;invalidusername_sessionID"