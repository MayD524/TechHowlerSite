"""

GET:
    /api/users/<username>
    
    - Info to get
        - name
        - email?
        - acc creation?
        - about & status.
        - pfp if we add that

POST:
    /api/users/<username>/<action>
    
    - Set:
        Status
        Grade
        name
        about & status
        pfp
        etc
"""
from pprint import pprint
import json
import os

def getUserData(username: str, dbHandler) -> dict:
    dbHandler.move("users")
    userData = dbHandler.where(("username", username))
    dbHandler.back()
    return userData

"""
    I have no clue why this is happening
    I think this is the only place where it is an issue
"""
if "?null" in inputData:
    inputData = inputData.replace("?null", "")

stripable = "/api/users/"
userPath = inputData.replace(stripable, "")


if method == "GET":
    ## this should just need userPath
    dt = getUserData(userPath, dbhandler).copy()
    if isinstance(dt, dict):
        del dt["password"]
        del dt["warns"]
        OutData = json.dumps(dt, indent=4)
        Result = 200
    else:
        OutData = "User not found"
        Result = 404
    
else:
    ## we needa do more to userPath
    username, action = userPath.split("/", 1)
    Result = 200