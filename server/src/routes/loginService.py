
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
import base64

def decryptPassword(passw:str, key:str) -> str:
    passw = base64.b64encode(passw)
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    return unpad(cipher.decrypt(passw), 16)

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
    
uname = inputData['name']
passw = inputData['password']
key   = inputData['sessionID']

if isValidUser(uname, passw, key, dbhandler):
    Result  = 200
    OutData = "LOGIN_SUCCESS;username=%s;session=%s" % (uname, key)

    cookies['user'] = uname
    cookies['key']  = key
else:
    Result = 500
    OutData = "LOGIN_FAILURE"
    
