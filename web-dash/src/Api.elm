module Api exposing
    ( getSchedule
    , url
    )

import Http
import Schedule


url : String
url =
    "http://localhost:8080"


getSchedule : (Result Http.Error (List Schedule.Item) -> msg) -> Cmd msg
getSchedule toMsg =
    Http.get
        { url = url ++ "/api/schedule"
        , expect = Http.expectJson toMsg Schedule.scheduleDecoder
        }
