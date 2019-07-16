@app
arcauth

@http
get /
# API
post /api/signup
post /api/login
post /api/logout
post /api/notes
get  /api/notes
post /api/notes/:noteID
post /api/notes/:noteID/del

@static
staging arctonic-staging
production arctonic-production

@tables
accounts
  accountID *String

notes
  accountID *String
  noteID **String
