import datetime

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
        "studentID": int(inputData["studentID"]),
        "firstName": fname,
        "lastName" : lname,
        "grade"    : int(inputData['studentGR']),
        "authLevel": AUTH_LOW,
        "email"    : inputData["email"],
        "about"    : "New user say hi!",
        "status"   : "",
        "pfp"      : "",
        "warns"    : 0,
        "accCreate": datetime.datetime.now().strftime("%A - %w - %H:%M:%S - %Z %b/%d/%Y")
    })
    
    Result = 200
    OutData = "ACCOUNT_CREATED"
    cookies['user'] = inputData['username']
    cookies['key']  = inputData['sessionID']
    sessionKeys[inputData['username']] = inputData['sessionID']

dbhandler._write()
dbhandler.back()