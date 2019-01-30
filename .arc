@app
arcauth

@http
get /
get /signup # symlink to / (handled in frontend js)
get /login # symlink to / (handled in frontend js)
post /api/signup
post /api/login
post /api/logout

post /notes
get /notes/:noteID
post /notes/:noteID
post /notes/:noteID/del

@static
staging arcauth-staging
production arcauth-production

@tables
accounts
  accountID *String

notes
  accountID *String
  noteID **String
