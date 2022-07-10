import json
print()
initRoute = "/api/getPost/"
req = givenPath.replace(initRoute, '')

reqMin, reqMax = req.split("&")

try:
    reqMin, reqMax = int(reqMin), int(reqMax)
    dbhandler.move("post")
    dbt = dbhandler.getTable().copy()
    
    dbt = dbt['data'][::-1]
    print(dbt)
    dt = []
    for x in range(reqMin, reqMax):
        if x >= len(dbt):
            break
        dt.append(dbt[x])

    Result = 200
    OutData = json.dumps(dt)
    
except TypeError:
    Result = 500
    OutData = "Could not get posts in range (%s,%s) because one value is not an integer." %(reqMin, reqMax)
dbhandler.back()