@app
arctonic

@aws
region us-west-2
profile default
bucket arctonic

@static
@http
get /
# API
post /api/signup
post /api/login
post /api/logout
post /api/notes
get  /api/notes
post /api/notes/:noteID/del

@tables
accounts
  accountID *String

notes
  accountID *String
  noteID **String
