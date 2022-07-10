from datetime import datetime
import markdown
import uuid

topic = path.replace("/api/post/", "")

## blog should require higher auth than general posting

print(cookies)
if "username" in cookies.keys():
    dbhandler.move("users")
    user = dbhandler.where(("username", cookies['username']))
    dbhandler.back()
    
    if user['authLevel'] < authLevel:
        Result = 401
        OutData = "User is not authorized to do this function."
    
    else:
        try:
            dbhandler.insertAt({
                "UUID"     : str(uuid.uuid4()),
                "author"   : user["username"],
                "postDate" : datetime.now().strftime("%A - %w - %H:%M:%S - %Z %b/%d/%Y"),
                "message"  : markdown.markdown(inputData).replace("\n", "<br>"),
                "likes"    : 0,
                "resources": "",
                "parent"   : "",
                "form"     : topic
                }, "post")

            dbhandler._write()
        
            Result = 200
            OutData = "Post has been made!"
        except Exception as e:
            Result = 500
            OutDat = str(e)
            raise
else:
    Result = 401
    OutData = "You need to be logged in to complete this action."