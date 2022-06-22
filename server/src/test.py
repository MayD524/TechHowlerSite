from dbHandler import dbHandler
from router import *

nDb = dbHandler("./database/test.db")
rtr = router(nDb)

#rtr.newRoute(["GET", "POST"], "/", "MAY", "print('hello')", AUTH_DEV, True)

nDb. _write()