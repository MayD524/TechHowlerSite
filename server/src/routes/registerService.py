
def decryptPassword(passw:str, key:str) -> str:
    from base64 import b64encode
    from Crypto.Util.Padding import pad, unpad
    from Crypto.Cipher import AES
    passw = b64encode(passw.encode('utf-8'))
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    return unpad(cipher.decrypt(passw), 16)

if cookies == None:
    cookies = {}


dbhandler.move("users")
usr = dbhandler.where(("username", inputData['username']))

if usr:
    Result = 500
    OutData = "User %s already exists!" % inputData["username"]
else:
    nameSplit = inputData['fullName'].split(' ', 1)
    fname = nameSplit[0]
    lname = ''
    if len(nameSplit) > 1:
        lname = nameSplit[1]
    dbhandler.insert({
        "username" : inputData['username'],
        "password" : inputData['password'], #decryptPassword(inputData['password'], inputData['sessionID']),
        "studentID": inputData["studentID"],
        "firstName": fname,
        "lastName" : lname,
        "grade"    : inputData['studentGR'],
        "authLevel": AUTH_LOW,
        "email"    : inputData["email"]
    })
    
    Result = 200
    OutData = "ACCOUNT_CREATED"
    cookies['user'] = inputData['username']
    cookies['key']  = inputData['sessionID']


dbhandler.back()